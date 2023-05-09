#!/usr/bin/env node

import Plugin from "cln-plugin-js";
import NostrDMBot from "nostr-dm-bot";
import Formatter from "./formatter.js";
import ConfigReader from "./config-reader.js";
import MessageHandler from "./message-handler.js";
import FileLogger from "cln-plugin-js/file-logger.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const configReader = new ConfigReader('config.json')
const config = configReader.read()

const plugin = new Plugin({ dynamic: true }, new FileLogger('[nstrctrl]', path.join(__dirname, 'plugin.log')))
const bot = new NostrDMBot(config.relay, config.bot_secret, config.your_pubkey)
const messageHandler = new MessageHandler()

const allNotifications = [
	`channel_opened`,
	`channel_open_failed`,
	`channel_state_changed`,
	`connect`,
	`disconnect`,
	`invoice_payment`,
	`invoice_creation`,
	`forward_event`,
	`sendpay_success`,
	`sendpay_failure`,
	`coin_movement`,
	`balance_snapshot`,
	`block_added`,
	`openchannel_peer_sigs`,
	`shutdown`
]

const quietedNotifications = [
	`connect`,
	`disconnect`,
	`coin_movement`,
	`balance_snapshot`,
	`block_added`,
	`openchannel_peer_sigs`,
]

let ready = false

// Bot

bot.on('connect', async (data) => {
	plugin.log('connected to relay')

	await bot.publish('👍 connected to nostr-control 🤙')
	await bot.publish(Formatter.help())

	// Give the handler some time for old messages
	setTimeout(async () => {
		plugin.log('ready to handle messages')
		ready = true
	}, 3000)
})

bot.on('message', async (message) => {
	if (ready === true) {
		plugin.log('message received: ' + message)
		messageHandler.handle(message)
	}
})

// Message Handler

messageHandler.on('help', async () => {
	const message = Formatter.help()
	await bot.publish(message)
})

messageHandler.on('donate', async () => {
	const message = Formatter.donate()
	await bot.publish(message)
})

messageHandler.on('issue', async () => {
	const message = Formatter.issue()
	await bot.publish(message)
})

messageHandler.on('unknown', async () => {
	const message = Formatter.unknown()
	await bot.publish(message)
})

messageHandler.on('info', async () => {
	const info = await plugin.rpc.call('getinfo').catch((error) => {
		messageHandler.emit('error', error)
	})
	
	if (info === undefined) return
	plugin.log('getinfo: \n' + JSON.stringify(info))
	const message = Formatter.getinfo(info)
	plugin.log('getinfo: \n' + message)
	await bot.publish(message)
})

messageHandler.on('invoice', async (args) => {
	const msat_amount = parseInt(args[0]) * 1000
	const label = args[1]
	const description = args[2]

	const result = await plugin.rpc.call('invoice', { amount_msat: msat_amount, label: label, description: description }).catch((error) => {
		messageHandler.emit('error', error)
	})

	if (result === undefined) return

	await bot.publish(`${result.bolt11}`)
})

messageHandler.on('pay', async (args) => {
	const bolt11 = args[0]

	const result = await plugin.rpc.call('pay', { bolt11: bolt11 }).catch((error) => {
		messageHandler.emit('error', error)
	})

	if (result === undefined) return

	await bot.publish(`🤖 paid invoice 🤙`)
})

messageHandler.on('address', async () => {
	const result = await plugin.rpc.call('newaddr').catch((error) => {
		messageHandler.emit('error', error)
	})

	if (result === undefined) return

	await bot.publish(`${result.bech32}`)
})

messageHandler.on('error', async (error) => {
	await bot.publish(`🤖 error: ${JSON.stringify(error)}`)
})

// Silencing events

messageHandler.on('verbose', async () => {
	plugin.log('setting verbosity to verbose')
	config.verbosity = 'verbose' 
	config.show_failed_forwards = true
	plugin.log('updating config')
	plugin.log(JSON.stringify(config))
	configReader.write(config)
	await bot.publish('👍 verbosity set to verbose 🤙')
})

messageHandler.on('quiet', async () => {
	plugin.log('setting verbosity to quiet')
	config.verbosity = 'quiet' 
	config.show_failed_forwards = false
	plugin.log('updating config')
	plugin.log(JSON.stringify(config))
	configReader.write(config)
	await bot.publish('👍 verbosity set to quiet 🤙')
})

messageHandler.on('silent', async () => {
	plugin.log('setting verbosity to silent')
	config.verbosity = 'silent'
	config.show_failed_forwards = false
	plugin.log('updating config')
	plugin.log(JSON.stringify(config))
	configReader.write(config)
	await bot.publish('👍 verbosity set to silent 🤙')
})

// Subscriptions

allNotifications.forEach((notification) => {
	plugin.log('subscribing to ' + notification)
	plugin.subscribe(notification, async (data) => {
		plugin.log('notification received: ' + notification)
		if (config.verbosity === 'silent') {
			plugin.log(`<verbosity: silent> ${notification} silenced, skipping`)
			return
		} else if (config.verbosity === 'quiet' && quietedNotifications.includes(notification)) {
			plugin.log(`<verbosity: quiet> ${notification} silenced, skipping`)
			return
		} else if (config.show_failed_forwards === false && notification === 'forward_event' && data.forward_event.status !== 'settled') {
			plugin.log(`<show_failed_forwards: false> ${notification} silenced, skipping`)
			return
		}
		try {
			const message = Formatter[notification](data)
			plugin.log('publishing message: \n' + message)
			checkForUndefined(message, data)
			await bot.publish(message)
		} catch (error) {
			plugin.log('formatting error: ' + error)	
		}
	})
})

function checkForUndefined(message, data) {
	if (message.includes('undefined')) {
		plugin.log('[ERROR] found undefined field, original payload:')
		plugin.log(JSON.stringify(data))
	}
}

plugin.log('calling connect on bot')
await bot.connect()

plugin.log('calling start')
plugin.start()
