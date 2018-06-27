const cors = require('@koa/cors');
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const app = new koa();

const bot = require('./bot');

require('dotenv').config();

app.use(cors());
app.use(bodyParser());

const port = process.env.PORT || 3000;
console.log(process.env.PORT);

async function setUpApp() {
  app.use(
    route.get('/api/ken/aka', async ctx => {
      console.log('Got the request');
      const failIfBroken = ctx.request.query.failIfBroken || undefined;
      ctx.response.statusCode = 200;
      const dataToRespondWith = {
        success: true,
        names: ['No names']
      };
      ctx.response.body = dataToRespondWith;
    })
  );

  console.log('app listening on port ' + port);
  app.listen(port);
}

setUpApp();
bot.setup();
