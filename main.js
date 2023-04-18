#!/usr/bin/env node

import Plugin from "cln-plugin-js";
import NostrDMBot from "nostr-dm-bot";

const bot_secret = "45e237f0a302a7f5835137716341d5bd9019a86342ed7bd5d57c6e4fde98a47d"
const your_pubkey = "2f4fa408d85b962d1fe717daae148a4c98424ab2e10c7dd11927e101ed3257b2"
const some_relay = 'wss://nostr.klabo.blog'

const plugin = new Plugin({ dynamic: true })
const bot = new NostrDMBot(some_relay, bot_secret, your_pubkey)

bot.on('connect', async (data) => {
	await bot.publish('👍 connected')
})

bot.on('message', async (data) => {
	let info = await plugin.rpc('getinfo')
	await bot.publish(JSON.stringify(info))
})

plugin.subscribe("connect", async (data) => {
	await bot.publish('connect event')
})

plugin.subscribe("disconnect", async (data) => {
	await bot.publish('disconnect event')
})

await bot.connect()

plugin.start()