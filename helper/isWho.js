const { Telegraf } = require('telegraf');
const config = require('config')


const bot = new Telegraf(config.get('TELEGRAM_BOT_TOKEN'));
const channelUsername = config.get("TELEGRAM_CHANNEL_USERNAME");

async function isAdmin(userId) {
    const chatMember = await bot.telegram.getChatMember(`@${channelUsername}`, userId)
    if(chatMember.status == 'administrator') return true;
    
    return false;
}

async function isCreator(userId) {
    const chatMember = await bot.telegram.getChatMember(`@${channelUsername}`, userId)
    if(chatMember.status == 'creator') return true;
    else return false;
}

async function isMember(userId) {
    const chatMember = await bot.telegram.getChatMember(`@${channelUsername}`, userId)
    if(chatMember.status == 'member') return true;
    
    return false;
}


module.exports = {
    isAdmin,
    isCreator,
    isMember
}