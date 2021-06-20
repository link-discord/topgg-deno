# topgg-deno

Deno sdk for the top.gg api

## Usage

Posting stats

```js
import { Api } from 'https://deno.land/x/topgg-deno/mod.ts';

const api = new Api('Your Top.gg Token');

api.postStats({
	server_count: 0, // Guild count of your bot
});
```

Listening to votes using a webhook

```js
import { Webhook } from "https://deno.land/x/topgg-deno/mod.ts"

const webhook = new Webhook({
    port: 3000 // The port you want to listen to
    path: '/dblwebhook' // On which path you want to recieve vote events
})

webhook.on('vote', (vote) => {
    console.log(vote.user) // user who voted
})
```