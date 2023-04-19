#!/usr/bin/env node

import Plugin from "cln-plugin-js";
import NostrDMBot from "nostr-dm-bot";
import Formatter from "./formatter.js";
import ConfigReader from "./config-reader.js";
import MessageHandler from "./message-handler.js";

const config = new ConfigReader('nostr-config.json').read()

const plugin = new Plugin({ dynamic: true })
const bot = new NostrDMBot(config.relay, config.bot_secret, config.your_pubkey)
const messageHandler = new MessageHandler()

// Bot

bot.on('connect', async (data) => {
	await bot.publish('👍 connected')
})

bot.on('message', async (message) => {
	messageHandler.handle(message)
})

await bot.connect()

// Message Handler

messageHandler.on('help', async () => {
	await bot.publish('🤖 help')
})

messageHandler.on('info', async () => {
	await bot.publish('🤖 info')
})

messageHandler.on('invoice', async (args) => {
	const msat_amount = parseInt(args[0]) * 1000
	const label = args[1]
	const description = args[2]
	const invoice = await plugin.call('invoice', { msatoshi: msat_amount, label: label, description: description })
	await bot.publish(`🤖 invoice: ${invoice}`)
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

plugin.start()