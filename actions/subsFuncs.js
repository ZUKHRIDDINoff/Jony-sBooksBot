const { isWho, dbFunctions, mainFunctions, downloadFile } = require('../helper/index');

async function checkSubscription(ctx) {
    try {
        const ctxMessage = ctx.update.callback_query;   
        const userId = ctxMessage.from.id;
        const messageId = ctxMessage.message.message_id;

        if (await isWho.isMember(userId)) {
            // const { messageId, message, extra } = await customerMenu();
            const files = await downloadFile.readMyFile();
            let result = await dbFunctions.getAllFiles('fileInCustomer', files);
            const message = "📁 Mavjud fayllar:"
            const extra = {
                reply_markup: {
                inline_keyboard: result[0],
                }
            }
            return mainFunctions.editMessageText(userId, messageId, message, extra);
        }
    
        const message = "❌ Siz shartlarni to'liq bajarmadingiz!"
        await mainFunctions.answerCallbackQuery(ctxMessage.id, message, true);
        
    } catch (error) {
        console.log('Problem while checking subscription' + error.message);
    }
}

module.exports = {
    checkSubscription
}