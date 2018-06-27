const Twit = require('twit');
const config = require('./config');

let bot;

function setup() {
  bot = new Twit(config.twitterKeys);
  console.log('Bot starting...');
  runCheck();
  setInterval(runCheck, config.twitterConfig.check);
}

const runCheck = async () => {
  console.log('Checking for names via the Twitter API');
};

module.exports = {
  setup: setup
};
