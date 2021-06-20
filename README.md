# topgg-deno
 Deno sdk for the top.gg api
## Usage
Posting stats
```js
import { Api } from "https://deno.land/x/topgg-deno/mod.ts"

const api = new Api("Your Top.gg Token")

api.postStats({
   server_count: 0 // Guild count of your bot
})
```

Listening to votes using a webhook
```js
import { Api } from "https://deno.land/x/topgg-deno/mod.ts"

const api = new Api("Your Top.gg Token", {
  port: 3000 // The port you want to listen to
  path: '/dblwebhook' // On which path you want to recieve vote events
})

Api.on('vote', (vote) => {
  // vote will be your vote object, e.g
  console.log(vote.user) // 395526710101278721 < user who voted\
})
```
