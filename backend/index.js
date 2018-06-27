const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const app = new koa();

const bot = require('./bot');
const db = require('./db');

require('dotenv').config();

app.use(cors());
app.use(bodyParser());

const port = process.env.PORT || 3000;
console.log(process.env.PORT);

async function setUpApp() {
  await db.setup();
  bot.setup();

  app.use(
    route.get('/api/aka/:screenName', async (ctx, screenName) => {
      console.log('Got the request', { screenName });

      try {
        const data = await db.getResultsForScreenName(screenName);
        ctx.response.statusCode = 200;
        ctx.response.body = { success: true, data };
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
