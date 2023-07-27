const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://shashankdkte:npJgoqJ6P6tR2fhE@nasacluster.pwrca91.mongodb.net/nasa_db?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
}