// deno-lint-ignore-file no-explicit-any
import { Bot } from './interfaces/Bot.ts';
import { BotsQuery } from './interfaces/BotsQuery.ts';
import { BotsResponse } from './interfaces/BotsResponse.ts';
import { BotStats } from './interfaces/BotStats.ts';
import { PostBotStats } from './interfaces/PostBotStats.ts';
import { User } from './interfaces/User.ts';
import { VotesResponse } from './interfaces/VotesResponse.ts';

export class Client {
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
		if (this.ratelimited) throw new Error('You are being ratelimited by the top.gg API.');

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

		if (response.headers.get('Content-Type')?.startsWith('application/json')) data = await response.json();
		else data = await response.text();

		return data;
	}

	async getBot(id: string): Promise<Bot> {
		if (id.length === 0) throw new Error("The 'id' argument cannot be empty");
		return (await this.handleRequest('GET', `/bots/${id}`)) as Bot;
	}

	async getUser(id: string): Promise<User> {
		if (id.length === 0) throw new Error("the 'id' argument cannot be empty");
		return await this.handleRequest('GET', `/users/${id}`);
	}

	async getBots(query?: BotsQuery): Promise<BotsResponse> {
		if (query) {
			if (Array.isArray(query.fields)) query.fields = query.fields.join(', ');
			if (typeof query.search === 'object' && query.search !== null && !Array.isArray(query.search))
				query.search = Object.entries(query.search)
					.map(([K, V]) => `${K}: ${V}`)
					.join(' ');
		}

		return (await this.handleRequest('GET', '/bots', query)) as BotsResponse;
	}

	async getVotes(id: string): Promise<VotesResponse> {
		if (id.length === 0) throw new Error("The 'id' argument cannot be empty");
		return (await this.handleRequest('GET', `/bots/${id}/votes`)) as VotesResponse;
	}

	async getStats(id: string): Promise<BotStats> {
		if (id.length === 0) throw new Error("The 'id' argument cannot be empty");
		return (await this.handleRequest('GET', `/bots/${id}/stats`)) as BotStats;
	}

	async postStats(id: string, options: PostBotStats): Promise<void> {
		if (id.length === 0) throw new Error("The 'id' argument cannot be empty");
		await this.handleRequest('POST', `/bots/${id}/stats`, options);
	}

	async hasVoted(botid: string, userid: string): Promise<boolean> {
		if (botid.length === 0 || userid.length === 0) throw new Error("The 'id' argument cannot be empty");
		return Boolean((await this.handleRequest('GET', `/bots/${botid}/check?userId=${userid}`)).voted);
	}
}

export default Client;
