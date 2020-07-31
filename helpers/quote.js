const QuoteModel = mongoose.model('Quote');
const fs = require('fs').promises;

const Quote = {
  getRandom: async () => {
    const results = await QuoteModel.find({status: true}).exec();
    return results[Math.floor(Math.random() * results.length)];
  },
  hasImage: async (quoteId) => {
    try {
      await fs.access(`${process.env.IMAGE_PATH}/${quoteId}.png`);
      return true;
    } catch {
      return false;
    }
  }
};

module.exports = Quote;
