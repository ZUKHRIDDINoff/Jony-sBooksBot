const { Telegraf } = require('telegraf');
const config = require('config')
const bot = new Telegraf(config.get('TELEGRAM_BOT_TOKEN'));

const Actions = require('./actions/index');
const { start } = require('./main/start');

const express = require('express')
const app = express()
const port = 3300

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

bot.start(ctx => start(ctx));

bot.telegram.setMyCommands([
    {
        command: '/start',
        description: "Botni qayta ishga tushirish"
    }
])
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

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))