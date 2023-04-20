# Example usage

```javascript
import NostrDMBot from "./nostr.js"

const bot_secret = "45e237f0a302a7f5835137716341d5bd9019a12342ed7bd5d57c6e4fde98a47d"
const your_pubkey = "2f4fa408d85b962d1fe717daae148a4c98424ab2e10c7dd11927e101ed3257b2"
const some_relay = 'wss://nostr.klabo.blog'

const bot = new NostrDMBot(some_relay, bot_secret, your_pubkey)

bot.on('message', (msg) => {
	console.log('👍 received message', msg)
})

bot.on('connect', async () => {
	console.log('👍 connected to relay')
	await bot.publish('Hello world')
})

bot.on('error', (err) => {
	console.log('👎 error', err)
})

setTimeout(() => {
  console.log('Timeout reached, process will exit');
}, 3600000); // Keep the proc

await bot.connect()
```