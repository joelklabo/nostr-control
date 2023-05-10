class AliasFetcher {
	//Query: lightning-cli sql -o "SELECT DISTINCT n.alias, pc.short_channel_id FROM nodes n JOIN peerchannels pc ON n.nodeid = pc.peer_id JOIN forwards f ON (pc.short_channel_id = f.in_channel OR pc.short_channel_id = f.out_channel)"

		constructor(rpc) {
				this.aliasCache = {};
				this._rpc = rpc;
				this._query = {query: "SELECT DISTINCT pc.short_channel_id, n.alias FROM nodes n JOIN peerchannels pc ON n.nodeid = pc.peer_id JOIN forwards f ON (pc.short_channel_id = f.in_channel OR pc.short_channel_id = f.out_channel)"};
		}

		async get(scid) {
			if (!this.aliasCache.hasOwnProperty(scid)) {
				let aliases = await this._rpc.call("sql", this._query);
				for (let result of aliases.rows) {
					this.aliasCache[result[0]] = result[1];
				}
			}
			return this.aliasCache[scid] || scid;
		}
}

export default AliasFetcher;