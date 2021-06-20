// deno-lint-ignore-file camelcase
export interface Bot {
	id: string;
	username: string;
	discriminator: string;
	avatar?: string;
	defAvatar: string;
	bannerUrl?: string;
	lib: string;
	prefix: string;
	shortdesc: string;
	longdesc?: string;
	tags: string[];
	website?: string;
	support?: string;
	github?: string;
	owners: string;
	guilds: string;
	invite?: string;
	date: string;
	server_count?: number;
	shard_count?: number;
	certifiedBot: boolean;
	vanity?: string;
	points: number;
	monthlyPonumbers: number;
	donatebotguildid: string;
}

export default Bot;
