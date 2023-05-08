#!/usr/bin/env node

import Plugin from "./plugin.js";
import FileLogger from "./file-logger.js";

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

const plugin = new Plugin({ dynamic: true })
const logger = new FileLogger('[Example]')

plugin.addMethod("testinfo", "get info", "description", async () => {
	return await plugin.rpc.call("getinfo")
})


allNotifications.forEach(notification => {
	plugin.subscribe(notification, (params) => {
		logger.log(`Received notification: ${notification}`)
		logger.log(`Params: ${JSON.stringify(params)}`)
	})
})

plugin.start()