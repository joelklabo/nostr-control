#!/usr/bin/env node

import Plugin from "./plugin.js";
import log from "./log.js";

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

plugin.addOption("test", "string", "test option", "test")
plugin.addMethod("testinfo", "get info", "description")

allNotifications.forEach(notification => {
	plugin.subscribe(notification, (params) => {
		log(`Received notification: ${notification}`)
		log(`Params: ${JSON.stringify(params)}`)
	})
})

plugin.start()