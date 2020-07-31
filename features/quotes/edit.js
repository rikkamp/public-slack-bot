const { BotkitConversation } = require('botkit');
const QuoteModel = mongoose.model('Quote');

module.exports = controller => {
  const EDIT_CONVO = 'edit-convo';
  let editConvo = new BotkitConversation(EDIT_CONVO, controller);

  editConvo.ask('Welke quote wil je aanpassen?', async answer => {}, { key: 'quoteId' });

  controller.hears('aanpassen', 'direct_message', async (bot, message) => {
    const Quotes = await QuoteModel.find({ 'author.userId': message.user });
  });
};
