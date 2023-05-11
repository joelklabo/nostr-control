import MillisatParser from "./millisat-parser.js"

class Formatter {

	// System 

	static help() {
		return `🤖 nostr-control 🤖

/help - show this help
/info - show node info
/channels - Get information about your channels
/invoice [amount_sats] [label] [description] - create an invoice
/pay [bolt11] - pay an invoice
/address - get a new address (Bech32)
/donate - tip me some ⚡️
/issue - report an issue
/verbose - show everything (including failed forwards)
/quiet - show only successful forwards (and payment related events)
/silent - show no notifications
/version - see the current version of nostr-control`
	}

	static unknown() {
		return `🤖 unknown command 🤖

type /help for a list of commands`
	}

	static issue() {
		return `🤖 report an issue 🤖

File an issue here: https://github.com/joelklabo/nostr-control/issues`
	}

	static donate() {
		return `🤖 donate 🤖

BTC ⛓️: bc1q4gahrs92m4fz6el39zk3zy546psgl3sndezz9l

LN Address ⚡️: joel@klabo.blog

Tips: https://klabo.blog/tip

Follow me on Nostr: npub19a86gzxctwtz68l8zld2u9y2fjvyyj4juyx8m5geylssrmfj27eqs22ckt

GitHub ⭐️: https://github.com/joelklabo/nostr-control`
	}

	static async channels(channels) {
    const graphLength = 15; // Length of the line graph

    let message = `📊 channel summary 📊\n`;

    for (let channel of channels) {
        const alias = await this.aliasCache.get(channel.scid) || channel.scid;

        const spendable = MillisatParser.parseInput(channel.spendable, true);
        const receivable = MillisatParser.parseInput(channel.receivable, true);
        const total = MillisatParser.parseInput(channel.total, true);

        const spendablePercentage = channel.spendable / channel.total;
        let spendableGraphPosition = Math.round(spendablePercentage * graphLength);
        
        // Ensure the vertical line is always present
        if (spendableGraphPosition === 0) {
            spendableGraphPosition = 1;
        } else if (spendableGraphPosition >= graphLength) {
            spendableGraphPosition = graphLength - 1;
        }

        let lineGraph = "";
        for (let i = 0; i < graphLength; i++) {
            if (i === spendableGraphPosition) {
                lineGraph += "|";
            } else {
                lineGraph += "─";
            }
        }

        message += `\n${alias}\n${lineGraph}\ntotal: ${total}\n`;
    }
    return message;
}
	
	// RPC

	// Example of getinfo response:
	//	"id": "03955cdc9ba1949429cc235cd9d8022d74fecb555009762ebaac6afddc4ea69d18",
	//	"alias": "HAPPYWAFFLE",
	//	"color": "03955c",
	//	"num_peers": 1,
	//	"num_pending_channels": 0,
	//	"num_active_channels": 2,
	//	"num_inactive_channels": 0,
	//	"address": [],
	//	"binding": [
	//		 {
	//				"type": "ipv4",
	//				"address": "127.0.0.1",
	//				"port": 7171
	//		 }
	//	],
	//	"version": "v22.11.1",
	//	"blockheight": 563,
	//	"network": "regtest",
	//	"fees_collected_msat": 0,
	//	"lightning-dir": "/tmp/l1-regtest/regtest",
	//	"our_features": {
	//		 "init": "08a000080269a2",
	//		 "node": "88a000080269a2",
	//		 "channel": "",
	//		 "invoice": "02000000024100"
	//	}	

	static getinfo(info) {
		const addressInfo = info.address.length > 0 ? `${info.id}@${info.address[0].address}:${info.address[0].port}` : "?";
		return `🤖 node info 🤖

${info.alias}
ID: ${info.id}
Address: ${info.id}@${addressInfo}
Color: ${info.color}
Peers: ${info.num_peers}
Active channels: ${info.num_active_channels}
Inactive channels: ${info.num_inactive_channels}
Pending channels: ${info.num_pending_channels}
Version: ${info.version}
Blockheight: ${info.blockheight}
Network: ${info.network}
Fees collected: ${MillisatParser.parseInput(info.fees_collected_msat, true)} ⚡️`
	}

	// Example of a channel_opened notification:
	//	"id": "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
	//	"funding_msat": 100000000,
	//	"funding_txid": "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
	//	"channel_ready": false

	static channel_opened(data) {
		const info = data.channel_opened
		return `🆕 ${MillisatParser.parseInput(info.funding_msat, true)} ⚡️ channel open 🆕

with: 
${info.id}`;
	}

	// Example of a channel_open_failed notification:
	//	"channel_id": "a2d0851832f0e30a0cf778a826d72f077ca86b69f72677e0267f23f63a0599b"

	static channel_open_failed(data) {
		const info = data.channel_open_failed
		return `💔 channel open failed 💔

channel id:
${info.channel_id}`;
	}

	// Example of a channel_state_changed notification:
	//	"peer_id": "03bc9337c7a28bb784d67742ebedd30a93bacdf7e4ca16436ef3798000242b2251",
	//	"channel_id": "a2d0851832f0e30a0cf778a826d72f077ca86b69f72677e0267f23f63a0599b4",
	//	"short_channel_id" : "561820x1020x1",
	//	"timestamp":"2023-01-05T18:27:12.145Z",
	//	"old_state": "CHANNELD_NORMAL",
	//	"new_state": "CHANNELD_SHUTTING_DOWN",
	//	"cause" : "remote",
	//	"message" : "Peer closes channel"

	static channel_state_changed(data) {
		const info = data.channel_state_changed
		return `🍃 channel state changed 🍃

peer:
${info.peer_id}
${info.old_state} -> ${info.new_state}`;
	}

	// Example of a connect notification:
	//	"id": "02f6725f9c1c40333b67faea92fd211c183050f28df32cac3f9d69685fe9665432",
	//	"direction": "in",
	//	"address": "1.2.3.4:1234"

	static connect(data) {
		return `🤝 connected 🤝

${data.id} ${data.direction == 'in' ? '(in)' : '(out)'}`;
	}

	// Example of a disconnect notification:
	//	"id": "02f6725f9c1c40333b67faea92fd211c183050f28df32cac3f9d69685fe9665432"

	static disconnect(info) {
		return `👋 disconnected 👋

${info.id}`;
	}

	// Example of a invoice_payment notification:
	//	"label": "unique-label-for-invoice",
	//	"preimage": "0000000000000000000000000000000000000000000000000000000000000000",
	//	"msat": 10000msat
	static invoice_payment(data) {
		const info = data.invoice_payment
		const msat = parseInt(info.msat.replace('msat', ''));
		const sats = msat / 1000;
		return `🧾 payment 🧾

${MillisatParser.parseInput(info.msat, true)} ⚡️`;
	}

	// Example of a invoice_creation notification:		
	//	"label": "unique-label-for-invoice",
	//	"preimage": "0000000000000000000000000000000000000000000000000000000000000000",
	//  "msat": 10000msat

	static invoice_creation(data) {
		const info = data.invoice_creation
		return `💸 invoice created 💸

${MillisatParser.parseInput(info.msat, true)} ⚡️`;
	}

	// Example of a warning notification:
	//	"level": "warn",
	//	"time": "1559743608.565342521",
	//	"source": "lightningd(17652): 0821f80652fb840239df8dc99205792bba2e559a05469915804c08420230e23c7c chan #7854:",
	//	"log": "Peer permanent failure in CHANNELD_NORMAL: lightning_channeld: sent ERROR bad reestablish dataloss msg"

	static warning(info) {
		return `🚨 warning 🚨

${info.log}`;
	}

	// forward_event: {
	// 	payment_hash:
	// 		"5b7ae144baf46759dcda3b299695768f73542e746db822683470c8fdc22c8438",
	// 	in_channel: "566x1x0",
	// 	in_htlc_id: 1,
	// 	out_channel: "1092x1x0",
	// 	in_msat: 10001,
	// 	out_msat: 10000,
	// 	fee_msat: 1,
	// 	status: "settled",
	// 	style: "tlv",
	// 	received_time: 1682310437.179,
	// 	resolved_time: 1682310437.239,
	// },

	static async forward_event(data) {
		const info = data.forward_event
		const in_alias = await this.aliasCache.get(info.in_channel) || info.in_channel
		const out_alias = await this.aliasCache.get(info.out_channel) || info.out_channel

		return `🔀 routed ${info.status == "local_failed" ? "N/A" : MillisatParser.parseInput(info.out_msat, true)} ⚡️ 🔀

${in_alias} > ${out_alias}
fee ${info.status == "local_failed" ? "N/A" : MillisatParser.parseInput(info.fee_msat, true)} ⚡️
status ${info.status}`;
	}

	// Example of a sendpay_success notification:
	//	"id": 1,
	//	"payment_hash": "5c85bf402b87d4860f4a728e2e58a2418bda92cd7aea0ce494f11670cfbfb206",
	//	"destination": "035d2b1192dfba134e10e540875d366ebc8bc353d5aa766b80c090b39c3a5d885d",
	//	"amount_msat": 100000000, (69590514msat)
	//	"amount_sent_msat": 100001001, (69590514msat)
	//	"created_at": 1561390572,
	//	"status": "complete",
	//	"payment_preimage": "9540d98095fd7f37687ebb7759e733934234d4f934e34433d4998a37de3733ee"

	static sendpay_success(data) {
		return `👍 payment succeeded 👍`
	}

	// Example of a sendpay_failure notification:
	//	"code": 204,
	//	"message": "failed: WIRE_UNKNOWN_NEXT_PEER (reply from remote)",
	//	"data": {
	//		"id": 2,
	//		"payment_hash": "9036e3bdbd2515f1e653cb9f22f8e4c49b73aa2c36e937c926f43e33b8db8851",
	//		"destination": "035d2b1192dfba134e10e540875d366ebc8bc353d5aa766b80c090b39c3a5d885d",
	//		"amount_msat": 100000000,
	//		"amount_sent_msat": 100001001,
	//		"created_at": 1561395134,
	//		"status": "failed",
	//		"erring_index": 1,
	//		"failcode": 16394,
	//		"failcodename": "WIRE_UNKNOWN_NEXT_PEER",
	//		"erring_node": "022d223620a359a47ff7f7ac447c85c46c923da53389221a0054c11c1e3ca31d59",
	//		"erring_channel": "103x2x1",
	//		"erring_direction": 0
	//	}

	static sendpay_failure(data) {
		const info = data.sendpay_failure
		const destination = info.data.destination
		const message = info.message
		return `👎 payment failed 👎

${destination} ${message}`;
	}

	// Example of a coin_movement notification:
	//	"version":2,
	//	"node_id":"03a7103a2322b811f7369cbb27fb213d30bbc0b012082fed3cad7e4498da2dc56b",
	//	"type":"chain_mvt",
	//	"account_id":"wallet",
	//	"originating_account": "wallet", // (`chain_mvt` only, optional)
	//	"txid":"0159693d8f3876b4def468b208712c630309381e9d106a9836fa0a9571a28722", // (`chain_mvt` only, optional)
	//	"utxo_txid":"0159693d8f3876b4def468b208712c630309381e9d106a9836fa0a9571a28722", // (`chain_mvt` only)
	//	"vout":1, // (`chain_mvt` only)
	//	"payment_hash": "xxx", // (either type, optional on both)
	//	"part_id": 0, // (`channel_mvt` only, optional)
	//	"credit_msat":2000000000,
	//	"debit_msat":0,
	//	"output_msat": 2000000000, // ('chain_mvt' only)
	//	"output_count": 2, // ('chain_mvt' only, typically only channel closes)
	//	"fees_msat": 382, // ('channel_mvt' only)
	//	"tags": ["deposit"],
	//	"blockheight":102, // 'chain_mvt' only
	//	"timestamp":1585948198,
	//	"coin_type":"bc"

	static coin_movement(data) {
		const info = data.coin_movement
		return `🪙 coin movement: ${info.type} 🪙

credit: ${MillisatParser.parseInput(info.credit_msat, true)} ⚡️
debit: ${MillisatParser.parseInput(info.debit_msat, true)} ⚡️`;
	}

	// Example of a balance_snapshot (too complex for now):
	
	static balance_snapshot(info) {
		return `TODO: Balance snapshot event`;
	}

	// Example of block notifications:
	//	"hash": "000000000000000000034bdb3c01652a0aa8f63d32f949313d55af2509f9d245",
	//	"height": 753304

	static block_added(data) {
		const info = data.block
		return `🧱 new block 🧱

height: ${info.height}
hash: ${info.hash}`;
	}

	// Example of open_channel_peer_sigs notification:
	//	"channel_id": "252d1b0a1e5789...",
	//	"signed_psbt": "cHNidP8BAKgCAAAAAQ+y+61AQAAAAD9////AzbkHAAAAAAAFgAUwsyrFxwqW+natS7EG4JYYwJMVGZQwwAAAAAAACIAIKYE2s4YZ+RON6BB5lYQESHR9cA7hDm6/maYtTzSLA0hUMMAAAAAAAAiACBbjNO5FM9nzdj6YnPJMDU902R2c0+9liECwt9TuQiAzWYAAAAAAQDfAgAAAAABARtaSZufCbC+P+/G23XVaQ8mDwZQFW1vlCsCYhLbmVrpAAAAAAD+////AvJs5ykBAAAAFgAUT6ORgb3CgFsbwSOzNLzF7jQS5s+AhB4AAAAAABepFNi369DMyAJmqX2agouvGHcDKsZkhwJHMEQCIHELIyqrqlwRjyzquEPvqiorzL2hrvdu9EBxsqppeIKiAiBykC6De/PDElnqWw49y2vTqauSJIVBgGtSc+vq5BQd+gEhAg0f8WITWvA8o4grxNKfgdrNDncqreMLeRFiteUlne+GZQAAAAEBIICEHgAAAAAAF6kU2Lfr0MzIAmapfZqCi68YdwMqxmSHAQcXFgAUAfrZCrzWZpfiWSFkci3kqV6+4WUBCGsCRzBEAiBF31wbNWECsJ0DrPel2inWla2hYpCgaxeVgPAvFEOT2AIgWiFWN0hvUaK6kEnXhED50wQ2fBqnobsRhoy1iDDKXE0BIQPXRURck2JmXyLg2W6edm8nPzJg3qOcina/oF3SaE3czwz8CWxpZ2h0bmluZwEIexhVcpJl8ugM/AlsaWdodG5pbmcCAgABAAz8CWxpZ2h0bmluZwEIR7FutlQgkSoADPwJbGlnaHRuaW5nAQhYT+HjxFBqeAAM/AlsaWdodG5pbmcBCOpQ5iiTTNQEAA=="

	static openchannel_peer_sigs(info) {
		return `✍️ open channel peer sigs
${info.channel_id}`;
	}

	// Example of shutdown notification:

	static shutdown(info) {
		return `🔌 shutting down`;
	}

}

export default Formatter;