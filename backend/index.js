const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const app = new koa();
const redis = require('redis');
const cacheControl = require('koa-cache-control');

const bot = require('./bot');
const db = require('./db');

require('dotenv').config();

app.use(cors());
app.use(bodyParser());

const port = process.env.PORT || 8080;
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const cacheTtlSeconds = process.env.CACHE_TTL_SECONDS || 60;
app.use(
  cacheControl({
    maxAge: cacheTtlSeconds
  })
);

console.log({ port, redisUrl, cacheTtlSeconds });

// create a new redis client and connect to our local redis instance
const redisClient = redis.createClient({ url: redisUrl });

// if an error occurs, print it to the console
redisClient.on('error', err => console.error('Error ' + err));

async function setUpApp() {
  await db.setup();
  bot.setup();

  app.use(
    route.get('/api/aka/:screenName', async (ctx, screenName) => {
      try {
        await new Promise(resolve => {
          redisClient.get(screenName, async (error, result) => {
            if (result) {
              ctx.response.statusCode = 200;
              ctx.response.body = {
                success: true,
                data: JSON.parse(result)
              };
              resolve();
            } else {
              const data = await db.getResultsForScreenName(screenName);
              // with an expiry of 1 minute (60s)
              await redisClient.setex(
                screenName,
                cacheTtlSeconds,
                JSON.stringify(data)
              );
              ctx.response.statusCode = 200;
              ctx.response.body = { success: true, data };
              resolve();
            }
          });
        });
      } catch (e) {
        console.error(e);
        ctx.response.statusCode = 500;
        ctx.response.body = { success: false, error: e };
      }
    })
  );

  console.log('app listening on port ' + port);
  app.listen(port);
}

setUpApp();
