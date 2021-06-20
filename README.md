# topgg-deno

Deno sdk for the top.gg api

## Usage

The usage is essentially the same as the [node sdk](https://npmjs.com/package/@top-gg/sdk)
Only difference is that there is a different way to listen to vote events.

Example below on how to listen to vote events:

```js
import { Webhook } from "https://deno.land/x/topgg_deno/mod.ts"

const webhook = new Webhook({
    port: 3000, // The port you want to listen to
    path: '/dblwebhook' // On which path you want to recieve vote events
})

webhook.on('vote', (vote) => {
    console.log(vote.user) // user who voted
})
```
