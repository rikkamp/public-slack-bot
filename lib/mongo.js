const mongoose = require('mongoose');
const GenerateTile = require('../helpers/tile');

mongoose.connect('mongodb://127.0.0.1:27017/bot_michiel', { useNewUrlParser: true });

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const Quote = new Schema({
  author: Object,
  content: String,
  image: String,
  status: { type: Boolean, default: true },
  date: { type: Date, default: Date.now },
});

Quote.post('save', async doc => {
  await GenerateTile(doc);
});

mongoose.model('Quote', Quote);

const Reminder = new Schema({
  date: { type: Date, default: Date.now },
  status: { type: Boolean, default: true },
});

mongoose.model('Reminder', Reminder);

module.exports = mongoose;
