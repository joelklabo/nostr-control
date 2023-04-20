#!/usr/bin/env node

import Plugin from "cln-plugin-js";
import NostrDMBot from "nostr-dm-bot";
import Formatter from "./formatter.js";
import ConfigReader from "./config-reader.js";
import MessageHandler from "./message-handler.js";
import log from "./logger.js";

log('file loaded')

const config = new ConfigReader('config.json').read()

const plugin = new Plugin({ dynamic: true }, init)
const bot = new NostrDMBot(config.relay, config.bot_secret, config.your_pubkey)
const messageHandler = new MessageHandler()

async function init(plugin) {
	log('initialized callback called')
	await bot.connect()
}

let ready = false

// Bot

bot.on('connect', async (data) => {
	log('connected to relay')
	await bot.publish('👍 connected to nostr-control 🤙')
	await bot.publish(Formatter.help())

	// Give the handler some time for old messages
	setTimeout(async () => {
		ready = true
	}, 3000)
})

bot.on('message', async (message) => {
	log('message received:' + message)
	if (ready === true) {
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
	const info = await plugin.rpc('getinfo').catch((error) => {
		messageHandler.emit('error', error)
	})
	if (info === undefined) return

	const message = Formatter.getinfo(info)

	await bot.publish(message)
})

messageHandler.on('invoice', async (args) => {
	const msat_amount = parseInt(args[0]) * 1000
	const label = args[1]
	const description = args[2]

	const invoice = await plugin.rpc('invoice', { amount_msat: msat_amount, label: label, description: description }).catch((error) => {
		messageHandler.emit('error', error)
	})

	if (invoice === undefined) return

	await bot.publish(`${invoice.bolt11}`)
})

messageHandler.on('error', async (error) => {
	await bot.publish(`🤖 error: ${JSON.stringify(error)}`)
})

// Subscriptions

plugin.subscribe("channel_opened", async (data) => {
	const message = Formatter.channel_opened(data.channel_opened)
	await bot.publish(message)
})

plugin.subscribe("channel_open_failed", async (data) => {
	const message = Formatter.channel_open_failed(data.channel_open_failed)
	await bot.publish(message)
})

plugin.subscribe("channel_state_changed", async (data) => {
	const message = Formatter.channel_state_changed(data.channel_state_changed)
	await bot.publish(message)
})

plugin.subscribe("connect", async (data) => {
	const message = Formatter.connect(data)
	await bot.publish(message)
})

plugin.subscribe("disconnect", async (data) => {
	const message = Formatter.disconnect(data)
	await bot.publish(message)
})

plugin.subscribe("invoice_payment", async (data) => {
	const message = Formatter.invoice_payment(data)
	await bot.publish(message)
})

plugin.subscribe("invoice_creation", async (data) => {
	console.error(data)
	const message = Formatter.invoice_creation(data.invoice_creation)
	await bot.publish(message)
})

plugin.subscribe("forward_event", async (data) => {
	const message = Formatter.forward_event(data.forward_event)
	await bot.publish(message)
})

plugin.subscribe("sendpay_success", async (data) => {
	const message = Formatter.sendpay_success(data.sendpay_success)
	await bot.publish(message)
})

plugin.subscribe("sendpay_failure", async (data) => {
	const message = Formatter.sendpay_failure(data.sendpay_failure)
	await bot.publish(message)
})

plugin.subscribe("coin_movement", async (data) => {
	const message = Formatter.coin_movement(data.coin_movement)
	await bot.publish(message)
})

plugin.subscribe("balance_snapshot", async (data) => {
	const message = Formatter.balance_snapshot(data.balance_snapshot)
	await bot.publish(message)
})

plugin.subscribe("block_added", async (data) => {
	const message = Formatter.block(data.block)
	await bot.publish(message)
})

plugin.subscribe("openchannel_peer_sigs", async (data) => {
	const message = Formatter.openchannel_peer_sigs(data.openchannel_peer_sigs)
	await bot.publish(message)
})

plugin.subscribe("shutdown", async (data) => {
	const message = Formatter.shutdown(data)
	await bot.publish(message)
})

log('calling start')
plugin.start()