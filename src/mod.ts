// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.99.0/http/server.ts';
import { readAll } from 'https://deno.land/std@0.99.0/io/util.ts';
import { EventEmitter } from 'https://deno.land/x/event@2.0.0/mod.ts';
import { Bot } from './interfaces/Bot.ts';
import { BotsQuery } from './interfaces/BotsQuery.ts';
import { BotsResponse } from './interfaces/BotsResponse.ts';
import { BotStats } from './interfaces/BotStats.ts';
import { BotWebhook } from './interfaces/BotWebhook.ts';
import { PostBotStats } from './interfaces/PostBotStats.ts';
import { User } from './interfaces/User.ts';
import { VotesResponse } from './interfaces/VotesResponse.ts';

type Events = {
	vote: [BotWebhook];
	close: [void];
};

export class Api {
	private token!: string;
	private base: string;
	private ratelimited: boolean;

	constructor(token: string) {
		Object.defineProperty(this, 'token', {
			value: token,
			writable: true,
			configurable: true,
			enumerable: false,
		});
		this.base = 'https://top.gg/api';
		this.ratelimited = false;
	}

	private async handleRequest(method: string, path: string, body?: any): Promise<any> {
		if (this.ratelimited) {
			throw new Error('You are being ratelimited by the top.gg API.');
		}

		if (body && method === 'GET') path += `?${new URLSearchParams(body)}`;

		const response = await fetch(`${this.base}${path}`, {
			method,
			headers: {
				Authorization: this.token,
			},
			body: body && method !== 'GET' ? JSON.stringify(body) : undefined,
		});

		if (response.status === 429) {
			const timeout = Number(response.headers.get('retry-after')) * 1000;

			this.ratelimited = true;

			setTimeout(() => {
				this.ratelimited = false;
			}, timeout);

			throw new Error(`You are being ratelimited by the top.gg API. Please retry after: ${timeout}s`);
		}

		let data: any = null;

		if (response.headers.get('Content-Type')?.startsWith('application/json')) {
			data = await response.json();
		} else data = await response.text();

		return data;
	}

	async getBot(id: string): Promise<Bot> {
		if (!id || id.length === 0) throw new Error("The 'id' argument cannot be empty");
		return (await this.handleRequest('GET', `/bots/${id}`)) as Bot;
	}

	async getUser(id: string): Promise<User> {
		if (!id || id.length === 0) throw new Error("the 'id' argument cannot be empty");
		return await this.handleRequest('GET', `/users/${id}`);
	}

	async getBots(query?: BotsQuery): Promise<BotsResponse> {
		if (query) {
			if (Array.isArray(query.fields)) query.fields = query.fields.join(', ');
			if (typeof query.search === 'object' && query.search !== null && !Array.isArray(query.search)) {
				query.search = Object.entries(query.search)
					.map(([K, V]) => `${K}: ${V}`)
					.join(' ');
			}
		}

		return (await this.handleRequest('GET', '/bots', query)) as BotsResponse;
	}

	async getVotes(id: string): Promise<VotesResponse> {
		if (!id || id.length === 0) throw new Error("The 'id' argument cannot be empty");
		return (await this.handleRequest('GET', `/bots/${id}/votes`)) as VotesResponse;
	}

	async getStats(id: string): Promise<BotStats> {
		if (!id || id.length === 0) throw new Error("The 'id' argument cannot be empty");
		const data = await this.handleRequest('GET', `/bots/${id}/stats`);

		return {
			serverCount: data.server_count,
			shards: data.shards,
			shardCount: data.shard_count
		} as BotStats;
	}

	async postStats(options: PostBotStats): Promise<void> {
		await this.handleRequest('POST', `/bots/stats`, {
			server_count: options.serverCount,
			shard_id: options.shardId,
			shard_count: options.shardCount,
		});
	}

	async hasVoted(id: string): Promise<boolean> {
		if (!id || id.length === 0)  throw new Error("The 'id' argument cannot be empty");
		return Boolean((await this.handleRequest('GET', `/bots/check?userId=${id}`)).voted);
	}

	async isWeekend(): Promise<boolean> {
		return Boolean((await this.handleRequest('GET', `/weekend`)).is_weekend);
	}
}

export class Webhook extends EventEmitter<Events> {
	constructor(options: { port: number; path: string; password?: string }) {
		super();

		(async () => {
			const server = serve({ port: options.port });

			// @ts-ignore shut
			this.once('close', () => {
				server.close();
			});

			for await (const req of server) {
				const authHeader = req.headers.get('Authorization');

				switch (req.method) {
					case 'GET':
						req.respond({ body: 'The options is listening!\n' });
						break;

					case 'POST':
						if (authHeader && options.password && authHeader !== options.password) {
							req.respond({ status: 401, body: '' });
							return;
						} else if (!authHeader && options.password) {
							req.respond({ status: 401, body: '' });
							return;
						}

						readAll(req.body).then((buffer) => {
							const data: BotWebhook = JSON.parse(new TextDecoder().decode(buffer));
							this.emit('vote', data);
						});

						req.respond({ status: 200, body: '' });
						break;

					default:
						req.respond({ status: 200, body: '' });
						break;
				}
			}
		})();
	}

	closeWebhook() {
		this.emit('close');
	}
}
