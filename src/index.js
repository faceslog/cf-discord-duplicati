import { Router } from 'itty-router'
import { createEmbed } from './utils';

// Create a new router
const router = Router()

/*
Our index route, a simple hello world.
*/
router.get("/", () => {
  return new Response("Welcome ! Please check https://github.com/faceslog/cf-worker-duplicati")
});

router.post("/api/:name/:channel/:webhook", async (request) => {

  const params = request.params;

  const name = decodeURIComponent(params.name);
  const channelId = decodeURIComponent(params.channel);
  const webhookId = decodeURIComponent(params.webhook);
  const webhookUrl = `https://discord.com/api/webhooks/${channelId}/${webhookId}`

  // If the POST data is JSON then attach it to our response.
  if (request.headers.get("Content-Type") != "application/json")    
  { 
    return new Response(JSON.stringify({ status: 404, message: "No content provided" }), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      }
    });
  }

  let body = await request.json()
  let discordPayload = createEmbed(name, body.Data);

  const res = await fetch(webhookUrl, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    body: JSON.stringify(discordPayload)
  });

  if(res.status != 200 && res.status != 204) 
  {
    return new Response(JSON.stringify({ status: res.status, message: res.statusText }), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      }
    })
  } 

  return new Response(JSON.stringify({ status: 200, message: 'Discord webhook triggered' }), {
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    }
  })

});

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).
*/
router.all("*", () => new Response("404, not found!", { status: 404 }));

/*
This snippet ties our worker to the router we deifned above, all incoming requests
are passed to the router where your routes are called and the response is sent.
*/
addEventListener('fetch', (e) => {
  e.respondWith(router.handle(e.request))
});
