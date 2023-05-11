import MillisatParser from "./millisat-parser.js";

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
			chain_sat: onChainFunds,
			channel_sat: channelFunds
		};
		return result;
	}

	_parseOnChainFunds(fundsResponse) {
		let outputs = fundsResponse.outputs;
		let totalSats = 0;
		for (const output of outputs) {
			totalSats += MillisatParser.parseInput(output.amount_msat, true);
		}
		return totalSats;
	}

	_parseChannelFunds(fundsResponse) {
		let channels = fundsResponse.channels;
		let totalChannelMsats = 0;
		for (const channel of channels) {
			totalChannelMsats += MillisatParser.parseInput(channel.our_amount_msat, true);
		}
		return totalChannelMsats;
	}
}

export default FundsListFetcher;