const config = require('config');
const channelUsername = config.get("TELEGRAM_CHANNEL_USERNAME");
const { isMember } = require('./isWho');

const  mainFunctions  = require('./mainFunctions');
async function fileDownError(ctx) {
    try {
        const userId = ctx.update.message.from.id;
        if(isMember(userId)) return 
        const message = "❗️ Siz fayl yuborish kerak emas vaqtda, fayl yubordingiz!. Qaytadan fayl qo'shish bo'limiga kirib ko'ring!";
        const extra = {
            reply_markup: {
            inline_keyboard: [
                [{ text: "Fayl qo'shish", callback_data: 'addNewFile' }],
                [{ text: "Menyuga qaytish", callback_data: 'creatorMenu'}],
                ]
            }   
        }
        const messageId = ctx.update.message.message_id;

        await ctx.reply(message, extra);
        await mainFunctions.deleteMessage(ctx, userId, messageId-1)
    } catch (error) {
        console.log('Error while fileDownError: ' + error.message);
    }
}

async function subscriptionMessage() {
    const message = "❌ Kechirasiz botdan foydalanish uchun quyidagi kanalga a'zo bolishingizni so'raymiz."
    const extra =  {
        reply_markup: {
        inline_keyboard: [
            [{
            text: "Kanal",
            url: `https://t.me/${channelUsername}`
            }],
            [{
            text: "✅ Tekshirish",
            callback_data: 'checkSubscription'
            }]
        ]
        }
    }
    
    return  { message, extra };
}


module.exports = {
    fileDownError,
    subscriptionMessage
}