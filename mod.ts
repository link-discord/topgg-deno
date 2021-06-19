// deno-lint-ignore-file no-explicit-any
import { Bot } from './interfaces/Bot.ts';

export class Client {
	private token: string;
	private base: string;
	private ratelimiting: {
		ratelimited: boolean;
		retyAfter: number;
	};

	constructor(token: string) {
		this.token = token;
		this.base = 'https://top.gg/api/';
		this.ratelimiting = { ratelimited: false, retyAfter: 0 };
	}

	private async handleRequest(method: string, path: string, config?: any) {
		if (this.ratelimiting.ratelimited) throw new Error('You are being ratelimited by the top.gg API.');

		const response = await fetch(`${this.base}${path}`, {
			method: method,
			headers: {
				Authorization: this.token,
			},
			body: config ? JSON.stringify(config) : null,
		});

		if (response.status === 429) {
			const timeout = Number(response.headers.get('retry-after')) * 1000;

			setTimeout(() => {
				this.ratelimiting = { ratelimited: false, retyAfter: 0 };
			}, timeout);

			this.ratelimiting = { ratelimited: true, retyAfter: timeout };

			throw new Error('You are being ratelimited by the top.gg API.');
		}

		let data: any = null;

		if (response.headers.get('Content-Type')?.startsWith('application/json')) data = response.json();
		else data = response.text();

		return data;
	}

	async getBot(id: string) {
		if (id.length === 0) throw new Error('ID cant be empty.');
		return (await this.handleRequest('GET', `/bots/${id}`)) as Bot;
	}
}

export default Client;