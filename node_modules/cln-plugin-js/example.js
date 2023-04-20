#!/usr/bin/env node

import Plugin from "./plugin.js";
import log from "./log.js";

const plugin = new Plugin({ dynamic: true }, init)

async function init(plugin) {
	// Fully initialized `plugin` at this point
	let info = await plugin.rpc("getinfo", {})
	log(JSON.stringify(info))
}

plugin.addOption("test", "string", "test option", "test")
plugin.addMethod("testinfo", "get info", "description")

plugin.subscribe("connect", async (data) => {
	log("connect", data)
})

plugin.start()