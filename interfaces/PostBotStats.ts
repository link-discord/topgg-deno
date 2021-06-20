// deno-lint-ignore-file camelcase
export interface PostBotStats {
	server_count: number | number[];
	shards?: number[];
	shard_id?: number;
	shard_count?: number;
}
