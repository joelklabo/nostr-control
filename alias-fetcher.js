class AliasFetcher {
		constructor(rpc, plugin) {
				this.aliasCache = {};
				this.plugin = plugin;
				this.query = {query: "SELECT DISTINCT pc.short_channel_id, n.alias FROM nodes n JOIN peerchannels pc ON n.nodeid = pc.peer_id JOIN forwards f ON (pc.short_channel_id = f.in_channel OR pc.short_channel_id = f.out_channel)"};
				this.logger = logger;
		}

		async get(scid) {
			this.logger.logInfo(`getting alias for ${scid}`);
			if (!this.aliasCache.hasOwnProperty(scid)) {
				this.logger.logInfo(`alias not found for ${scid}`);
				let aliases = await this.plugin.rpc.call("sql", this.query);
				this.logger.logInfo('aliases query result');
				this.logger.logInfo(aliases);
				for (let result of aliases.rows) {
					this.aliasCache[result[0]] = result[1];
					this.logger.logInfo('updating alias cache');
					this.logger.logInfo(this.aliasCache);
				}
			} else {
				this.logger.logInfo(`alias (${this.aliasCache[scid]}) found for (${scid})`);
			}
			return this.aliasCache[scid] || scid;
		}
}

export default AliasFetcher;