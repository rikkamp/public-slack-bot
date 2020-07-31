const { Botkit } = require('botkit');
const { SlackAdapter, SlackMessageTypeMiddleware, SlackEventMiddleware } = require('botbuilder-adapter-slack');
const { MongoDbStorage } = require('botbuilder-storage-mongodb');

const mongoose = require('./lib/mongo');
global.mongoose = mongoose;
// Load process.env values from .env file
require('dotenv').config();

const adapter = new SlackAdapter({
  clientSigningSecret: process.env.clientSigningSecret,
  botToken: process.env.botToken,
});

adapter.use(new SlackEventMiddleware());
adapter.use(new SlackMessageTypeMiddleware());

let storage = null;
if (process.env.MONGO_URI) {
  storage = mongoStorage = new MongoDbStorage({
    url : process.env.MONGO_URI,
  });
}

const controller = new Botkit({
  webhook_uri: '/api/messages',
  adapter: adapter,
  storage,
  activity: {}
});

controller.ready(() => {
  controller.loadModule(__dirname + '/features/quotes/add.js');
  controller.loadModule(__dirname + '/features/quotes/default.js');
  controller.loadModule(__dirname + '/features/quotes/edit.js');
  controller.loadModule(__dirname + '/features/reminders/reminder.js');

  /* catch-all that uses the CMS to trigger dialogs */
  if (controller.plugins.cms) {
    controller.on('message,direct_message', async (bot, message) => {
      let results = false;
      results = await controller.plugins.cms.testTrigger(bot, message);

      if (results !== false) {
        // do not continue middleware!
        return false;
      }
    });
  }
});

controller.webserver.get('/', (req, res) => {
  res.send(`This app is running Botkit ${controller.version}.`);
});

controller.webserver.get('/install', (req, res) => {
  res.redirect(controller.adapter.getInstallLink());
});

controller.webserver.get('/install/auth', async (req, res) => {
  try {
    const results = await controller.adapter.validateOauthCode(req.query.code);
    console.log('FULL OAUTH DETAILS', results);
    tokenCache[results.team_id] = results.bot.bot_access_token;
    userCache[results.team_id] = results.bot.bot_user_id;
    res.json('Success! Bot installed.');
  } catch ( err ) {
    console.error('OAUTH ERROR:', err);
    res.status(401);
    res.send(err.message);
  }
});

controller.webserver.get('/public/images/:imageId', (req, res) => {
  res.sendFile(__dirname + '/public/images/' + req.params.imageId);
});

let tokenCache = {};
let userCache = {};

if ( process.env.TOKENS ) {
  tokenCache = JSON.parse(process.env.TOKENS);
}

if ( process.env.USERS ) {
  userCache = JSON.parse(process.env.USERS);
}



