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
          await db.insertAndTweetIfChanged(screenName, currentName, tweetNow);
        }
      }
    );
  }
};

async function tweetNow(text) {
  const tweet = {
    status: text
  };

  if (config.twitterConfig.enabled) {
    console.log('Going to try to tweet: ', text);
    bot.post('statuses/update', tweet, (err, data, response) => {
      if (err) {
        console.error('ERROR in tweeting!', err);
      } else {
        console.log('SUCCESS! tweeted: ', text);
      }
    });
  } else {
    console.log('Tweeting was disabled, but would have tweeted:', { text });
  }
}

module.exports = {
  setup: setup,
  tweetNow: tweetNow
};
