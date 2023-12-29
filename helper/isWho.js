const { Telegraf } = require('telegraf');
const config = require('config')


const bot = new Telegraf(config.get('TELEGRAM_BOT_TOKEN'));
const channelUsername = config.get("TELEGRAM_CHANNEL_USERNAME");

async function isAdmin(userId) {
    try {
        const chatMember = await bot.telegram.getChatMember(`@${channelUsername}`, userId)
        if(chatMember.status == 'administrator') return true;
        
        return false;
    } catch (error) {
        console.log('Error while isAdmin function: ' + error.message);
    }
}

async function isCreator(userId) {
    try {
        const chatMember = await bot.telegram.getChatMember(`@${channelUsername}`, userId)
        if(chatMember.status == 'creator') return true;
        else return false;
    } catch (error) {
        console.log('Error while isCreator function: ' + error.message);
    }
}

async function isMember(userId) {
    try {
        const chatMember = await bot.telegram.getChatMember(`@${channelUsername}`, userId)
        if(chatMember.status == 'member') return true;
        
        return false;
    } catch (error) {
        console.log('Error while isMember function: ' + error.message);
    }
}


module.exports = {
    isAdmin,
    isCreator,
    isMember
}