const client = require('mongodb').MongoClient;
const mongoUrl = process.env.MONGODB_URI;

let db;

async function setup() {
  db = await client.connect(mongoUrl);
  console.log('Initializing db...');
}

async function getResultsForScreenName(screenName) {
  const collection = db.collection(`results_${screenName}`);
  return collection.find({}, { name: 1, _id: 0 }).toArray();
}

async function getPreviousResultForScreenName(screenName) {
  const collection = db.collection(`results_${screenName}`);
  return collection
    .find({}, { name: 1, _id: 0 })
    .sort({ _id: -1 })
    .limit(1).result;
}

async function insertIfChanged(screenName, result) {
  const collection = db.collection(`results_${screenName}`);
  const previousResult = await getPreviousResultForScreenName(screenName);

  if (previousResult && previousResult.name !== result) {
    const data = { name: result };
    return await collection.insertOne(data);
  }
}

module.exports = {
  setup,
  getResultsForScreenName,
  insertIfChanged
};
