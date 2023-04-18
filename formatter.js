class Formatter {

	// Example of a channel_opened notification:
	//	"id": "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
	//	"funding_msat": 100000000,
	//	"funding_txid": "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b",
	//	"channel_ready": false

	static channel_opened(info) {
		return `${info.funding_msat / 1000} sat channel opened with ${info.id}`;
	}

	// Example of a channel_open_failed notification:
	//	"channel_id": "a2d0851832f0e30a0cf778a826d72f077ca86b69f72677e0267f23f63a0599b"

	static channel_open_failed(info) {
		return `Channel open failed with: ${info.channel_id}`;
	}

}

module.exports = Formatter;