#!/usr/bin/env node

import FileLogger from "cln-file-logger";
import Plugin from "./plugin.js";
import path from 'path';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = new FileLogger('[Example]', path.join(__dirname, 'example.log'))

const plugin = new Plugin({ dynamic: true }, logger)

plugin.addMethod("testinfo", "get info", "description", async () => {
	return await plugin.rpc.call("getinfo")
})


allNotifications.forEach(notification => {
	plugin.subscribe(notification, (params) => {
		logger.logInfo(`Received notification: ${notification}`)
		logger.logInfo(`Params: ${JSON.stringify(params)}`)
	})
})

plugin.start()