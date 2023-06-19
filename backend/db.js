const { MongoClient } = require('mongodb');
const mongoUrl = process.env.MONGODB_URI;

const bot = require('./bot');

let db;

async function setup() {
  const client = new MongoClient(mongoUrl);
  const dbName = 'ken-wheeler-aka';
  await client.connect();
  db = client.db(dbName);
  console.log('Initializing db...');
}

async function getResultsForScreenName(screenName) {
  const collection = db.collection(`results_${screenName}`);
  return collection.find({}, { name: 1, _id: 0 }).toArray();
}

async function getPreviousResultForScreenName(collection) {
  return collection
    .find({}, { name: 1, _id: 0 })
    .sort({ _id: -1 })
    .limit(1)
    .toArray(function(err, data) {
      if (err ? reject(err) : resolve(data[0]));
    });
}

async function insertAndTweetIfChanged(screenName, result, tweetNowFn) {
  const collection = db.collection(`results_${screenName}`);
  await getPreviousResultForScreenName(collection).then(previousResult => {
    console.log('Found from db:', { previousResult, result });

    if (!previousResult || (previousResult && previousResult.name !== result)) {
      // Always cast to string in order to allow "undefined" as a string etc.
      const data = { name: `${result}` };
      collection.insertOne(data);

      if (screenName === 'ken_wheeler') {
        const tweetText = `.@ken_wheeler is now known as "${result}". See https://ken-wheeler-aka.vercel.app/`;
        tweetNowFn(tweetText);
      }
    }
  });
}

module.exports = {
  setup,
  getResultsForScreenName,
  insertAndTweetIfChanged
};
