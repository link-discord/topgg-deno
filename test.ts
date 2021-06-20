import 'https://deno.land/x/dotenv@v2.0.0/load.ts';
import { assertEquals, assertThrowsAsync, assertExists } from 'https://deno.land/std@0.99.0/testing/asserts.ts';

import { Client } from './mod.ts';

const token = Deno.env.get('TOKEN') as string;
const port = Number(Deno.env.get('PORT'));

const client = new Client(token, { port: port, path: '/dblwebhook', password: 'denotest69420' });

const url = `http://localhost:${port}/dblwebhook`;

const webhookData = {
	bot: '706054368318980138',
	user: '476662199872651264',
	type: 'test',
	isWeekend: false,
};

console.clear();

Deno.test('fetch bot', async () => {
	const data = await client.getBot('706054368318980138');
	assertEquals(data.username, 'Anti NSFW');

	await assertThrowsAsync(async () => {
		await client.getBot('');
	});
});

Deno.test('fetch user', async () => {
	const data = await client.getUser('476662199872651264');
	assertEquals(data.username, 'Link');

	assertThrowsAsync(async () => {
		await client.getUser('');
	});
});

Deno.test('fetch votes', async () => {
	const data = await client.getVotes('706054368318980138');
	assertExists(data);

	assertThrowsAsync(async () => {
		await client.getVotes('');
	});
});

Deno.test('fetch stats', async () => {
	const data = await client.getStats('706054368318980138');
	assertExists(data);

	assertThrowsAsync(async () => {
		await client.getStats('');
	});
});

Deno.test('has voted', async () => {
	const data = await client.hasVoted('706054368318980138', '205680187394752512');
	assertEquals<boolean>(data, false);
});

Deno.test('webhook', () => {
	assertThrowsAsync(async () => {
		client.once('vote', () => {
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
	// @ts-ignore Using method just for testing
	client.closeWebhook()
}, 1500)