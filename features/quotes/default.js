const QuoteHelper = require('../../helpers/quote');
const GenerateTile = require('../../helpers/tile');

module.exports = (controller) => {
  /**
   * Returns a random quote
   */
  controller.hears('quote', ['direct_message','direct_mention','mention'], async (bot, message) => {
    const result = await QuoteHelper.getRandom();
    await bot.reply(message, result.content);
  });

  /**
   *
   */
  controller.hears('tegeltje', ['direct_message','direct_mention','mention'], async (bot, message) => {
    const result = await QuoteHelper.getRandom();

    if (!await QuoteHelper.hasImage(result._id)) {
      await GenerateTile(result);
    }

    console.log(result._id);

    await bot.reply(message, {
      'attachments': [
        {
          'fallback': 'Tegeltje',
          'image_url': `${process.env.PUBLIC_URI}/${process.env.IMAGE_PATH}/${result._id}.png`,
        },
      ],
    });
  });
};
