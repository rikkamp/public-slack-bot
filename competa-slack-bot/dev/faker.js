#!/usr/bin/env node
const argv = require('yargs').argv;

const faker = require('faker');
const mongoose = require('../lib/mongo');
const QuoteModel = mongoose.model('Quote');
// Load process.env values from .env file
require('dotenv').config();
const documentAmount = argv.documents || 50;


if (argv.flush) {
  (async () => {
    const res = await QuoteModel.deleteMany({}).exec();
    console.info(`Removed ${res.deletedCount} documents...Goodbye!`);
  })();
}

[...Array(documentAmount)].forEach(async (_, i) => {
  const Quote = new QuoteModel({
    author: {
      userId: faker.random.uuid(),
      name: faker.internet.userName(),
    },
    content: faker.lorem.sentence(),
  });
  await Quote.save();
});

console.info('All done, your can exit this script now');
