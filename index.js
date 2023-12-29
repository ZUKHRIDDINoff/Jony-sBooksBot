const { Telegraf } = require('telegraf');
const config = require('config')
const bot = new Telegraf(config.get('TELEGRAM_BOT_TOKEN'));

const Actions = require('./actions/index');
const { start } = require('./main/start');

bot.start(async ctx => start(ctx));

// Actions
bot.action('checkAllFiles', async ctx => Actions.fileActions.checkAllFiles(ctx));
bot.action('creatorMenu', async ctx => Actions.menuActions.creatorMenu(ctx, ctx.update.callback_query.from.id));
bot.action('customerMenu', async ctx => Actions.menuActions.customerMenu(ctx));
bot.action('checkSubscription', async (ctx) => Actions.subsFuncs.checkSubscription(ctx));
bot.action('addNewFile', async ctx => Actions.fileActions.addNewFile(ctx));


// bot.on
bot.on('document', async ctx => Actions.fileActions.documentFunctions(ctx))

// Callback functions
bot.on('callback_query', async ctx => Actions.fileActions.callbackQueryFunc(ctx));


bot.launch();