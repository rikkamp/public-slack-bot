const CronJob = require('cron').CronJob;
const ReminderModel = mongoose.model('Reminder');

module.exports = (controller) => {
  const job = new CronJob('* */5 * * * *', async () => {

    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);

    const startNotify = lastDayOfMonth.getDate() - 3;
    if (today.getDate() >= startNotify && today.getHours() > 10) {
      // Check if the reminder has been sent already
      const isSent = await ReminderModel.findOne({ 'date': today.toLocaleDateString('en-US', {timeZone: "Europe/Amsterdam"}) });
      if (isSent) {
        return false;
      }

      const Reminder = new ReminderModel({
        date: today.toLocaleDateString('en-US', {timeZone: "Europe/Amsterdam"}),
        status: true,
      });
      await Reminder.save();

      const daysLeft = Math.abs(lastDayOfMonth.getDate() - today.getDate());

      const bot = await controller.spawn({
        token: process.env.botToken,
        activity: {
          conversation: {}
        }
      });

      await bot.startConversationInChannel(process.env.mainChannel, 'ULESN2JKY');

      if (daysLeft >= 3) {
        await bot.say('🧏🏼‍♂️ _Vergeet je exact niet in te vullen! Je hebt nog 2 dagen_ <!here>');
      } else if (daysLeft === 2) {
        await bot.say('🙇‍♂️ _Nog 1 dag om je exact in te vullen!_ <!here>');
      } else if (daysLeft === 1) {
        await bot.say('⏳ _Laatste dag om je exact in te vullen!_ <!here>');
      }
    }
  });

  job.start();
};

