class AliasFetcher {
	//Query: lightning-cli sql -o "SELECT DISTINCT n.alias, pc.short_channel_id FROM nodes n JOIN peerchannels pc ON n.nodeid = pc.peer_id JOIN forwards f ON (pc.short_channel_id = f.in_channel OR pc.short_channel_id = f.out_channel)"

		constructor(rpc, logger) {
				this.aliasCache = {};
				this._rpc = rpc;
				this._query = {query: "SELECT DISTINCT pc.short_channel_id, n.alias FROM nodes n JOIN peerchannels pc ON n.nodeid = pc.peer_id JOIN forwards f ON (pc.short_channel_id = f.in_channel OR pc.short_channel_id = f.out_channel)"};
				this.logger = logger;
		}

		async get(scid) {
			this.logger.logInfo(`getting alias for ${scid}`);
			if (!this.aliasCache.hasOwnProperty(scid)) {
				this.logger.logInfo(`alias not found for ${scid}`);
				let aliases = await this._rpc.call("sql", this._query);
				this.logger.logInfo('aliases query result');
				this.logger.logInfo(aliases);
				for (let result of aliases.rows) {
					this.aliasCache[result[0]] = result[1];
					this.logger.logInfo('updating alias cache');
					this.logger.logInfo(this.aliasCache);
				}
			}
			return this.aliasCache[scid] || scid;
		}
}

export default AliasFetcher;