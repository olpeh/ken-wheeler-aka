const Twit = require('twit');
const config = require('./config');
const db = require('./db');

const { SCREEN_NAMES } = process.env;

let bot;

function setup() {
  bot = new Twit(config.twitterKeys);
  console.log('Bot starting...');
  runCheck();
  setInterval(runCheck, config.twitterConfig.check);
}

const runCheck = async () => {
  console.log('Checking for names via the Twitter API');
  const screenNames = SCREEN_NAMES.split(' ');

  for (const screenName of screenNames) {
    console.log(screenName);

    bot.get(
      'users/show',
      { screen_name: screenName, include_entities: false },
      async (err, data, response) => {
        if (err) {
          console.error('ERROR,', err);
        } else {
          console.log('SUCCESS: received: ', data.name);
          const currentName = data.name;
          await db.upsertResultForScreenName(screenName, currentName);
        }
      }
    );
  }
};

module.exports = {
  setup: setup
};
