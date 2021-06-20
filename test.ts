import 'https://deno.land/x/dotenv@v2.0.0/load.ts';
import { assertEquals, assertThrowsAsync, assertExists } from 'https://deno.land/std@0.99.0/testing/asserts.ts';

import { Api, Webhook } from './src/mod.ts';

const token = Deno.env.get('TOKEN') as string;
const port = Number(Deno.env.get('PORT'));

const api = new Api(token);
const webhook = new Webhook({ port: port, path: '/dblwebhook', password: 'denotest69420' })

const url = `http://localhost:${port}/dblwebhook`;

const webhookData = {
	bot: '706054368318980138',
	user: '476662199872651264',
	type: 'test',
	isWeekend: false,
};

console.clear();

Deno.test('fetch bot', async () => {
	const data = await api.getBot('706054368318980138');
	assertEquals(data.username, 'Anti NSFW');

	await assertThrowsAsync(async () => {
		await api.getBot('');
	});
});

Deno.test('fetch user', async () => {
	const data = await api.getUser('476662199872651264');
	assertEquals(data.username, 'Link');

	assertThrowsAsync(async () => {
		await api.getUser('');
	});
});

Deno.test('fetch votes', async () => {
	const data = await api.getVotes('706054368318980138');
	assertExists(data);

	assertThrowsAsync(async () => {
		await api.getVotes('');
	});
});

Deno.test('fetch stats', async () => {
	const data = await api.getStats('706054368318980138');
	assertExists(data);

	assertThrowsAsync(async () => {
		await api.getStats('');
	});
});

Deno.test('has voted', async () => {
	const data = await api.hasVoted('205680187394752512');
	assertEquals<boolean>(data, false);
});

Deno.test('webhook', () => {
	assertThrowsAsync(async () => {
		webhook.once('vote', () => {
			throw new Error('Succesfully failed')
		})

		await fetch(url, {
			method: 'POST',
			headers: { 'Authorization': 'denotest69420' },
			body: JSON.stringify(webhookData),
		});
	})

	assertThrowsAsync(async () => {
		const response = await fetch(url, {
			method: 'POST',
			body: JSON.stringify(webhookData),
		});

		if (response.status === 401) throw new Error('Unauthorized');
	});

	assertThrowsAsync(async () => {
		const response = await fetch(`http://localhost:${port}/dblwebhook`, {
			method: 'POST',
			headers: { Authorization: 'password123' },
			body: JSON.stringify(webhookData),
		});

		if (response.status === 401) throw new Error('Unauthorized');
	});

	for (const rid in Deno.resources()) {
		if (Deno.resources()[rid].startsWith('fetch')) {
			Deno.close(Number(rid));
		}
	}
});

setTimeout(() => {
	webhook.closeWebhook()
}, 1500)