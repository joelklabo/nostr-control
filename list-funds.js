class FundsListFetcher {
	constructor(plugin, logger) {
			this.plugin = plugin;
			this.logger = logger;
	}

	async get() {
		this.logger.logInfo('calling listfunds');
		let fundsResponse = await this.plugin.rpc.call("listfunds");
		this.logger.logInfo('listfunds response');
		this.logger.logInfo(fundsResponse);
		const onChainFunds = this._parseOnChainFunds(fundsResponse);
		const channelFunds = this._parseChannelFunds(fundsResponse);
		this.logger.logInfo('funds results (msat)');
		this.logger.logInfo(`${onChainFunds} on-chain`);
		this.logger.logInfo(`${channelFunds} in channels`);
		const result = {
			chain_msat: onChainFunds,
			channel_msat: channelFunds
		};
		return result;
	}

	_parseOnChainFunds(fundsResponse) {
		let outputs = fundsResponse.outputs;
		let totalMsats = 0;
		for (const output of outputs) {
			totalMsats += output.amount_msat;
		}
		return totalMsats;
	}

	_parseChannelFunds(fundsResponse) {
		let channels = fundsResponse.channels;
		let totalChannelMsats = 0;
		for (const channel of channels) {
			totalChannelMsats += channel.our_amount_msat;
		}
		return totalChannelMsats;
	}
}

export default FundsListFetcher;