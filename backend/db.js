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
  return new Promise((resolve, reject) => {
    db.collection(`results_${screenName}`)
      .find({}, { name: 1, _id: 0 })
      .sort({ _id: -1 })
      .limit(1)
      .toArray(function(err, data) {
        if (err ? reject(err) : resolve(data[0]));
      });
  });
}

async function insertIfChanged(screenName, result) {
  const collection = db.collection(`results_${screenName}`);
  getPreviousResultForScreenName(screenName).then(previousResult => {
    console.log({ previousResult, result });

    if (!previousResult || (previousResult && previousResult.name !== result)) {
      const data = { name: result };
      collection.insertOne(data);
      return true;
    }
    return false;
  });
}

module.exports = {
  setup,
  getResultsForScreenName,
  insertIfChanged
};
