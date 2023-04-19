# nostr-control

## Description

nostr-control is a Core Lightning plugin that allows you talk to your node over Nostr DM. It also will send you events from your node over Nostr DMs.

## What can I do with it?

When you first set up nostr-control you will start recieving DMs from your node about events that are happening. By default you will receive all events, but you can change this in the config file.

The events you can receive are:
- `channel_opened`
- `channel_open_failed`
- `channel_state_changed`
- `connect`
- `disconnect`
- `invoice_payment`
- `invoice_creation`
- `forward_event`
- `sendpay_success`
- `sendpay_failure`
- `coin_movement`
- `balance_snapshot`
- `block_added`
- `openchannel_peer_sigs`
- `shutdown`

The really cool thing about nostr-control is that you can communicate with your node. You can respond to it in your DMs and get information about your node. `/help` will give you a list of commands you can use.

Current commands:
- `/help` - Get a list of commands
- `/info` - Get information about your node
- `/invoice` - Create an invoice (pass amount_sats, label, and description)
- `/donate` - See how you can donate to the project
- `/issues` - Open a GitHub issue

## How do I set it up?

nostr-control uses Node.js and npm. You can install them from [here](https://nodejs.org/en/download/).

1. Clone the repo into your plugins directory
2. Run `npm install` in the nostr-control directory
3. Set up a config file (`config.json`) in this project's directory (see below)
4. Register the plugin with lightningd (https://docs.corelightning.org/docs/a-day-in-the-life-of-a-plugin)

## Config File

nostr-control needs some Nostr information to work. Specifically these items:
- `relay` - The relays you want to send events to
- `bot_secret` - The account that will be sending you DMs
- `your_pubkey` - Your pubkey so you will receive the events

There is an example config in the root directory `example-config.json` it looks like this. Input your information there and nostr-control will pick it up.

```javscript
{
	"relay": "some_relay",
	"bot_secret": "some_secret_key_hex",
	"your_pubkey": "your_pub_key_hex"
}
```

nostr-control also keeps track of it's own settings so you can update things on the fly. Where that file is stored depends on your environment. When running on `regtest` mine was stored here: `/tmp/l1-regtest/regtest/nostr-config.json` 

You probably won't need to change that but that's where things you set while running will be stored.

## How do I get my bot secret?

Just create an account on any Nostr app and use the secret key (hex). You can also update the profile picture etc. this way.

## Contribute

PRs and Issues are welcome. Follow me on Nostr @ npub19a86gzxctwtz68l8zld2u9y2fjvyyj4juyx8m5geylssrmfj27eqs22ckt or leave me a tip at my lightning address: joel@klabo.blog. Can also leave a tip on my site: https://klabo.blog/tip