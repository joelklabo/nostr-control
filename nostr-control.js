#!/usr/bin/env node

import Plugin from "cln-plugin-js";
import NostrDMBot from "nostr-dm-bot";
import Formatter from "./formatter.js";
import ConfigReader from "./config-reader.js";
import MessageHandler from "./message-handler.js";
import FileLogger from "cln-file-logger";
import AliasFetcher from "./alias-fetcher.js";
import ChannelSummaryFetcher from "./channel-summary.js";
import FundsListFetcher from "./list-funds.js";
import path from 'path';
import git from 'git-rev-sync';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logPath = path.join(__dirname, 'plugin.log')

const configReader = new ConfigReader('config.json')
const config = configReader.read()

const logger = new FileLogger('[nstrctrl]', logPath) 
const plugin = new Plugin({ dynamic: true }, logger.child('[plugin]'))
const bot = new NostrDMBot(config.relay, config.bot_secret, config.your_pubkey, logger.child('[NostrDMBot]'))
const messageHandler = new MessageHandler()
const aliasFetcher = new AliasFetcher(plugin, logger.child('[AliasFetcher]'))
const channelSummaryFetcher = new ChannelSummaryFetcher(plugin, logger.child('[ChannelSummaryFetcher]'))
const fundsListFetcher = new FundsListFetcher(plugin, logger.child('[FundsListFetcher]'))
const currentCommitHash = git.long(path.join(__dirname, '.git'))
logger.logInfo('current commit hash: ' + currentCommitHash)

let ready = false

logger.logInfo('current config')
logger.logInfo(config)

// Bot

bot.on('connect', async (data) => {
	logger.logInfo('connected to relay')

	await bot.publish('👍 connected to nostr-control 🤙')
	await bot.publish(Formatter.help())

	// Give the handler some time for old messages
	setTimeout(async () => {
		logger.logInfo('ready to handle messages')
		ready = true
	}, 3000)
})

bot.on('message', async (message) => {
	if (ready === true) {
		logger.logInfo('message received')
		logger.logInfo(message)
		messageHandler.handle(message)
	}
})

// Message Handler

messageHandler.on('help', async () => {
	const message = Formatter.help()
	logger.logInfo('publishing message')
	logger.logInfo(message)
	await bot.publish(message)
})

messageHandler.on('channels', async () => {
	const channels = await channelSummaryFetcher.get()
	const message = await Formatter.channels(channels)
	logger.logInfo('publishing message')
	logger.logInfo(message)
	await bot.publish(message)
})

messageHandler.on('funds', async () => {
	const funds = await fundsListFetcher.get()
	const message = await Formatter.funds(funds)
	logger.logInfo('publishing message')
	logger.logInfo(message)
	await bot.publish(message)
})

messageHandler.on('version', async () => {
	logger.logInfo('publishing message')
	logger.logInfo(currentCommitHash)
	await bot.publish(currentCommitHash)
})

messageHandler.on('donate', async () => {
	const message = Formatter.donate()
	logger.logInfo('publishing message')
	logger.logInfo(message)
	await bot.publish(message)
})

messageHandler.on('issue', async () => {
	const message = Formatter.issue()
	logger.logInfo('publishing message')
	logger.logInfo(message)
	await bot.publish(message)
})

messageHandler.on('unknown', async () => {
	const message = Formatter.unknown()
	logger.logInfo('publishing message')
	logger.logInfo(message)
	await bot.publish(message)
})

messageHandler.on('info', async () => {
	const info = await plugin.rpc.call('getinfo').catch((error) => {
		messageHandler.emit('error', error)
	})
	
	if (info === undefined) return
	const message = Formatter.getinfo(info)
	logger.logInfo('publishing message')
	logger.logInfo(message)
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

	logger.logInfo('result')
	logger.logInfo(result)

	const message = `${result.bolt11}`

	logger.logInfo('publishing message')
	logger.logInfo(message)

	await bot.publish(message)
})

messageHandler.on('pay', async (args) => {
	const bolt11 = args[0]

	const result = await plugin.rpc.call('pay', { bolt11: bolt11 }).catch((error) => {
		messageHandler.emit('error', error)
	})

	if (result === undefined) return
	
	logger.logInfo('result')
	logger.logInfo(result)

	const message = `🤖 paid invoice 🤙`
	
	logger.logInfo('publishing message')
	logger.logInfo(message)

	await bot.publish(`🤖 paid invoice 🤙`)
})

messageHandler.on('address', async () => {
	const result = await plugin.rpc.call('newaddr').catch((error) => {
		messageHandler.emit('error', error)
	})

	if (result === undefined) return

	logger.logInfo('result')
	logger.logInfo(result)
	
	const message = `${result.bech32}`

	logger.logInfo('publishing message')
	logger.logInfo(message)

	await bot.publish(message)
})

messageHandler.on('error', async (error) => {
	await bot.publish(`🤖 error: ${JSON.stringify(error)}`)
})

// Silencing events

messageHandler.on('verbose', async () => {
	logger.logInfo('setting verbosity to verbose')
	config.verbosity = 'verbose' 
	config.show_failed_forwards = true
	logger.logInfo('updating config')
	logger.logInfo(config)
	configReader.write(config)
	await bot.publish('👍 verbosity set to verbose 🤙')
})

messageHandler.on('quiet', async () => {
	logger.logInfo('setting verbosity to quiet')
	config.verbosity = 'quiet' 
	config.show_failed_forwards = false
	logger.logInfo('updating config')
	logger.logInfo(config)
	configReader.write(config)
	await bot.publish('👍 verbosity set to quiet 🤙')
})

messageHandler.on('silent', async () => {
	logger.logInfo('setting verbosity to silent')
	config.verbosity = 'silent'
	config.show_failed_forwards = false
	logger.logInfo('updating config')
	logger.logInfo(config)
	configReader.write(config)
	await bot.publish('👍 verbosity set to silent 🤙')
})

// Subscriptions

allNotifications.forEach((notification) => {
	logger.logInfo('subscribing to ' + notification)
	plugin.subscribe(notification, async (data) => {
		logger.logInfo('notification received: ' + notification)
		if (config.verbosity === 'silent') {
			logger.logInfo(`<verbosity: silent> ${notification} silenced, skipping`)
			return
		} else if (config.verbosity === 'quiet' && quietedNotifications.includes(notification)) {
			logger.logInfo(`<verbosity: quiet> ${notification} silenced, skipping`)
			return
		} else if (config.show_failed_forwards === false && notification === 'forward_event' && data.forward_event.status !== 'settled') {
			logger.logInfo(`<show_failed_forwards: false> ${notification} silenced, skipping`)
			return
		}
		try {
			const message = await Formatter[notification](data)
			logger.logInfo('publishing message')
			logger.logInfo(message)
			checkForUndefined(message, data)
			await bot.publish(message)
		} catch (error) {
			logger.logError('formatting error') 
			logger.logError(error)	
		}
	})
})

function checkForUndefined(message, data) {
	if (message.includes('undefined')) {
		logger.logError('found undefined field, original payload:')
		logger.logError(data)
	}
}

logger.logInfo('calling connect on bot')
await bot.connect()

logger.logInfo('calling start')
plugin.start()

Formatter.aliasCache = aliasFetcher
