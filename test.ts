import 'https://deno.land/x/dotenv@v2.0.0/load.ts';
import { assertEquals, assertThrowsAsync } from 'https://deno.land/std@0.99.0/testing/asserts.ts';

import { Client } from './mod.ts';

const client = new Client(Deno.env.get('TOKEN') as string);

Deno.test('fetch bot data', async () => {
  const data = await client.getBot('706054368318980138');
  assertEquals(data.username, 'Anti NSFW');

  assertThrowsAsync(async () => {
    await client.getBot('');
  });
});
