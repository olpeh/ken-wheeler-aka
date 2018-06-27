const client = require('mongodb').MongoClient;
const mongoUrl = process.env.MONGODB_URI;

let db;

async function setup() {
  db = await client.connect(mongoUrl);
  console.log('Initializing db...');
}

async function getResultsForScreenName(screenName) {
  const collection = db.collection(`results_${screenName}`);
  return collection.find().toArray();
}

async function upsertResultForScreenName(screenName, result) {
  const collection = db.collection(`results_${screenName}`);
  const data = { name: result };
  return await collection.update(data, data, { upsert: true });
}

module.exports = {
  setup,
  getResultsForScreenName,
  upsertResultForScreenName
};
