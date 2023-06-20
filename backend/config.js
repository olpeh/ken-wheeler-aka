require('dotenv').config();

module.exports = {
  twitterKeys: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  },
  twitterConfig: {
    check: process.env.TWITTER_CHECK_RATE * 1000 * 60,
    enabled: process.env.TWEETING_ENABLED === 'true' || false
  }
};
