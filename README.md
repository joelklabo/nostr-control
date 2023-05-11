# `nostr-control`

[![Formatter Tests](https://github.com/joelklabo/nostr-control/actions/workflows/formatter-tests.yml/badge.svg)](https://github.com/joelklabo/nostr-control/actions/workflows/formatter-tests.yml)

Planned Features:

- [x] Disable events
- [x] Only settled forwards
- [x] Channel summary
- [ ] Routing summary
- [ ] NWC (NIP-47, Nostr Wallet Connect)

## Description

`nostr-control` is a Core Lightning plugin that allows you talk to your node over Nostr DM. It also will send you events from your node over Nostr DMs.

## Requirements
Tested with Core Lightning `v23.02.2` and Node 18. `nostr-control` uses the `sql` lightning-cli call so any version that supports that should work.

## Screenshots
| Info | Channel Summary| Create Invoice | Pay Invoice | Get Address | See Forwards | New Blocks (etc.) |
| - | - | - | - | - | - | - |
|![IMG_2262](https://user-images.githubusercontent.com/264977/234135277-075c3a99-510c-4b39-a643-17421e5af100.PNG)|![IMG_2348](https://github.com/joelklabo/nostr-control/assets/264977/f0cc4c16-2440-40f4-8b1e-1dd7f1619b5d)|![IMG_2258](https://user-images.githubusercontent.com/264977/234135152-7debd1ea-4f73-4d1e-9a07-1f80b3335d8b.PNG) |![IMG_2352](https://github.com/joelklabo/nostr-control/assets/264977/61d733ec-d33e-45ab-9920-7c58ac452c33)|![IMG_2261](https://user-images.githubusercontent.com/264977/234135150-16d2f2b9-11c5-44e6-ab3f-dd7e61017800.PNG) | ![IMG_9AF1D5254260-1](https://github.com/joelklabo/nostr-control/assets/264977/14789bac-0f5e-4ecd-ae79-d904e8f977aa)|![IMG_2258](https://user-images.githubusercontent.com/264977/234135155-51e7810b-f548-4bcc-ac21-e962cf1a331c.PNG) |

## What can I do with it?

When you first set up `nostr-control` you will start recieving DMs from your node about events that are happening. By default you will receive all events, but you can change this in the config file.

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

The most interesting thing about `nostr-control` is that you can communicate with your node. You can respond to it in your DMs and get information about your node. `/help` will give you a list of commands you can use.

Current commands:

- `/help` - Get a list of commands
- `/info` - Get information about your node
- `/channels` - Get information about your channels
- `/invoice` - Create an invoice (pass amount_sats, label, and description)
- `/pay` - Pay an invoice (pass bolt11)
- `/address` - Get a new address (Bech32)
- `/donate` - See how you can donate to the project
- `/issues` - Open a GitHub issue
- `/verbose` - show everything (including failed forwards)
- `/quiet` - show only successful forwards (and payment related events)
- `/silent` - show no notifications
- `/version` - see the version of nostr-control you are running

## How do I set it up?

`nostr-control` uses Node.js and npm. You can install them from [here](https://nodejs.org/en/download/).

1. Clone the repo into your plugins directory (DO NOT RUN `npm install` packages are checked in and there is a modification needed for this to run.)
2. Set up a config file (`config.json`) in this project's directory (see below)
3. Register the plugin with lightningd (https://docs.corelightning.org/docs/a-day-in-the-life-of-a-plugin)

## Config File

`nostr-control` needs some Nostr information to work. Specifically these items:

### Required
- `relay` - The relays you want to send events to
- `bot_secret` - The account that will be sending you DMs
- `your_pubkey` - Your pubkey so you will receive the events

### Optional
- `verbosity` - How much information you want to receive (see above)
- `show_failed_forwards` - Whether or not to show failed forwards (see above)

There is an example config in the root directory `example-config.json` it looks like this. Input your information there and nostr-control will pick it up.

```javascript
{
  relay: "some_relay",
  bot_secret: "some_secret_key_hex",
  your_pubkey: "your_pub_key_hex",
  verbosity: "verbose",
  show_failed_forwards: true
}
```

`nostr-control` also keeps track of it's own settings so you can update things on the fly. Create your `config.json` in the root directory and it will be picked up.

You probably won't need to change that but that's where things you set while running will be stored.

## How do I get my bot secret?

Just create an account on any Nostr app and use the secret key (hex). You can also update the profile picture etc. this way.

## Contribute ( please do )

PRs and Issues are welcome. Follow me on Nostr [npub19a86gzxctwtz68l8zld2u9y2fjvyyj4juyx8m5geylssrmfj27eqs22ckt](https://nostr.directory/p/joelklabo) or leave me a tip at my lightning address: [joel@klabo.blog](lightning:joel@klabo.blog). Can also leave a tip on my site: [Klabo.blog](https://klabo.blog/tip)
