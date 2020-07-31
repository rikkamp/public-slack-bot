const { BotkitConversation } = require('botkit');
const QuoteModel = mongoose.model('Quote');

module.exports = function (controller) {
  const ADD_CONVO = 'add-convo';
  let addConvo = new BotkitConversation(ADD_CONVO, controller);

  addConvo.addMessage('👐 Dan doe ik het niet!', 'add_quote_abort');
  addConvo.addMessage('🙏 Okidoki!', 'add_quote_success');

  addConvo.ask('Laat die quote maar horen!', async answer => {}, { key: 'quote' });

  addConvo.ask(
    'De volgende quote wordt toegevoegd: *{{vars.quote}}*, klopt dat? \n\n _Antwoord met *ja* om toe te' +
      ' voegen_',
    [
      {
        pattern: 'ja',
        handler: async (response, convo, bot) => {
          convo.setVar('status', true);
          await convo.gotoThread('add_quote_success');
        },
      },
      {
        default: true,
        handler: async (response, convo, bot) => {
          convo.setVar('status', false);
          await convo.gotoThread('add_quote_abort');
        },
      },
    ],
    'confirm'
  );

  addConvo.after(async (results, bot) => {
    const { user } = await bot.api.users.info({ user: results.user });
    if (results.status) {
      const Quote = new QuoteModel({
        author: {
          userId: user.id,
          name: user.real_name,
        },
        content: results.quote,
      });

      await Quote.save();
    }
  });

  controller.addDialog(addConvo);

  controller.hears('toevoegen', 'direct_message', async (bot, message) => {
    await bot.beginDialog(ADD_CONVO, {
      user: message.user,
    });
  });
};
