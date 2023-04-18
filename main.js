#!/usr/bin/env node

import Plugin from "cln-plugin-js";
import NostrDMBot from "nostr-dm-bot";
import Formatter from "./formatter.js";

const bot_secret = "45e237f0a302a7f5835137716341d5bd9019a86342ed7bd5d57c6e4fde98a47d"
const your_pubkey = "2f4fa408d85b962d1fe717daae148a4c98424ab2e10c7dd11927e101ed3257b2"
const some_relay = 'wss://nostr.klabo.blog'

const plugin = new Plugin({ dynamic: true })
const bot = new NostrDMBot(some_relay, bot_secret, your_pubkey)

bot.on('connect', async (data) => {
	await bot.publish('👍 connected')
})

bot.on('message', async (data) => {
	//let info = await plugin.rpc('getinfo')
	//await bot.publish(JSON.stringify(info))
})

await bot.connect()

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