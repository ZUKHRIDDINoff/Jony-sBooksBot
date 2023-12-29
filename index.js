const { Telegraf } = require('telegraf');
const config = require('config')
const bot = new Telegraf(config.get('TELEGRAM_BOT_TOKEN'));

const Actions = require('./actions/index');
const { start } = require('./main/start');

bot.start(ctx => start(ctx));

// Actions
bot.action('checkAllFiles', ctx => Actions.fileActions.checkAllFiles(ctx));
bot.action('creatorMenu', ctx => Actions.menuActions.creatorMenu(ctx, ctx.update.callback_query.from.id));
bot.action('customerMenu', ctx => Actions.menuActions.customerMenu(ctx));
bot.action('checkSubscription', (ctx) => Actions.subsFuncs.checkSubscription(ctx));
bot.action('addNewFile', ctx => Actions.fileActions.addNewFile(ctx));


// bot.on
bot.on('document', ctx => Actions.fileActions.documentFunctions(ctx))

// Callback functions
bot.on('callback_query', ctx => Actions.fileActions.callbackQueryFunc(ctx));


bot.launch();
