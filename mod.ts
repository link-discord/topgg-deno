// deno-lint-ignore-file no-explicit-any
import { Bot } from './interfaces/Bot.ts';

export class Client {
	private token: string;
	private base: string;
	private ratelimited: boolean;

	constructor(token: string) {
		this.token = token;
		this.base = 'https://top.gg/api/';
		this.ratelimited = false;
	}

	private async handleRequest(method: string, path: string, config?: any) {
		if (this.ratelimited) throw new Error('You are being ratelimited by the top.gg API.');

		const response = await fetch(`${this.base}${path}`, {
			method: method,
			headers: {
				Authorization: this.token,
			},
			body: config ? JSON.stringify(config) : null,
		});

		if (response.status === 429) {
			const timeout = Number(response.headers.get('retry-after')) * 1000;

			this.ratelimited = true;

			setTimeout(() => {
				this.ratelimited = false;
			}, timeout);

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
