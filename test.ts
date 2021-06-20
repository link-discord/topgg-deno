import 'https://deno.land/x/dotenv@v2.0.0/load.ts';
import { assertEquals, assertThrowsAsync, assertExists } from 'https://deno.land/std@0.99.0/testing/asserts.ts';

import { Client } from './mod.ts';

const client = new Client(Deno.env.get('TOKEN') as string);

Deno.test('fetch bot', async () => {
	const data = await client.getBot('706054368318980138');
	assertEquals(data.username, 'Anti NSFW');

	assertThrowsAsync(async () => {
		await client.getBot('');
	});
});

Deno.test('fetch user', async () => {
	const data = await client.getUser('476662199872651264');
	assertEquals(data.username, 'Link');

	assertThrowsAsync(async () => {
		await client.getUser('')
	})
})

Deno.test('fetch votes', async () => {
	const data = await client.getVotes('706054368318980138')
	assertExists(data)

	assertThrowsAsync(async () => {
		await client.getVotes('');
	});
})

Deno.test('fetch stats', async () => {
	const data = await client.getStats('706054368318980138')
	assertExists(data)

	assertThrowsAsync(async () => {
		await client.getStats('')
	})
})

Deno.test('has voted', async () => {
	const data = await client.hasVoted('706054368318980138', '205680187394752512')
	assertEquals<boolean>(data, false)
})