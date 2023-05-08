# Example Usage

```javascript
#!/usr/bin/env node

import { Plugin } from "./plugin.js";
import { log } from "./log.js";

const plugin = new Plugin({ dynamic: true })

plugin.addOption("test", "string", "test option", "test")
plugin.addMethod("testinfo", "get info", "description")

plugin.subscribe("connect", async (data) => {
	log("connect", data)
})

plugin.start()

setTimeout(async () => {
	let info = await plugin.rpc("getinfo", {})
	log(JSON.stringify(info))
}, 2000)
```
