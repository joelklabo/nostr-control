class ChannelSummaryFetcher {
	constructor(plugin, logger) {
			this.plugin = plugin;
			this.query = {query: "SELECT short_channel_id, spendable_msat, receivable_msat, total_msat FROM peerchannels"};
			this.logger = logger;
	}

	async get() {
		this.logger.logInfo('getting channel summary');
		let channelSummary = await this.plugin.rpc.call("sql", this.query);
		this.logger.logInfo('channel summary query result');
		this.logger.logInfo(channelSummary);
		const result = this._parseRows(channelSummary.rows);
		this.logger.logInfo('channel summary result');
		this.logger.logInfo(result);
		return result;
	}

	_parseRows(rows) {
		let channels = [];
		for (let row of rows) {
			let channelSummary = {
				scid: row[0],
				spendable: row[1],
				receivable: row[2],
				total: row[3]
			};
			channels.push(channelSummary);
		}
		return channels;
	}
}

export default ChannelSummaryFetcher;