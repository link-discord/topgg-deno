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

## How often do I update this?

Anytime the top.gg api changes or if deno introduces a breaking change that breaks my code or if a bug is found by you and you create an issue about it.
So don't be concerned that this is oudated or unmaintained because my commits are like 8 months old, its just that there is nothing to do.
