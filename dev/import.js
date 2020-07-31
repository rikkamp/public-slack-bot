#!/usr/bin/env node

const mongoose = require('../lib/mongo');
const QuoteModel = mongoose.model('Quote');
const GenerateTile = require('../helpers/tile');
const Quotes = require('./example.json');
// Load process.env values from .env file
require('dotenv').config();

Quotes.forEach(async item => {
  const Quote = new QuoteModel({
    author: {
      userId: item.user.id,
      name: item.user.name,
    },
    content: item.quote,
    status: item.approved,
  });

  await Quote.save();
});
