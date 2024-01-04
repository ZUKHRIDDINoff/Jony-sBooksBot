const config = require('config');
const fs = require('fs');
const path = require('path');
const { Telegraf } = require('telegraf');
const bot = new Telegraf(config.get('TELEGRAM_BOT_TOKEN'));

// Send message to user
async function sendMessage(chatId, message, extra = {}) {
    const result = await bot.telegram.sendMessage(chatId, message, extra);
    return result;
}

// Edit message
async function editMessageText(userId, messageId, text, extra) {
    try {
        const result = await bot.telegram.editMessageText(userId, messageId, null, text,  extra);

        return result;
    } catch (error) {
        console.log('Error while editMessageText function: ' + error.message);
    }
}

// Edit document, music, all type of fyles
async function editMessageMedia(userId, messageId, text = null, fileId,  extra = {}) {
    try {
        const result = bot.telegram.editMessageMedia(userId, messageId, null, { type: 'document', media: fileId, caption: text}, extra);
        return result;
    } catch (error) {
        console.log('Error while editMessageMedia function: ' + error.message);
    }
}

async function answerCallbackQuery(clbk_id, text, show_alert = false) {
    try {
        bot.telegram.answerCbQuery(clbk_id, text, { show_alert });   
    } catch (error) {
        console.log('Error while answerCallbackQuery function: ' + error.message);
    }
}

// Send file to user
async function sendFile(userId, fileId, extra = {}) {
    try {
        lastFileId = await bot.telegram.sendDocument(userId,fileId, extra);

    } catch (error) {
        console.log('Error with sending file' + error.message);
    }
}

// Delete message
function deleteMessage(ctx, userId = null, messageId = null) {
    try {
        if(userId && messageId) return bot.telegram.deleteMessage(userId, messageId);
        else return ctx.deleteMessage();        
    } catch (error) {
        console.log('Problem while deleting message or file' + error.message);
    }
}
module.exports = {
    sendMessage,
    editMessageText,
    answerCallbackQuery,
    editMessageMedia,
    sendFile,
    deleteMessage
}
