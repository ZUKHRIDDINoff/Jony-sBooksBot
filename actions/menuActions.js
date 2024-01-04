const { mainFunctions, isWho, errors, dbFunctions, downloadFile } = require('../helper/index');


async function creatorMenu(ctx, userId) {
    try {
        const message = "Administrator paneliga xush kelibsiz. \nMenyudan birini tanglang:"
        let messageId = null;
        if(ctx.update.callback_query && ctx.update.callback_query.message.message_id){
            messageId = ctx.update.callback_query.message.message_id;
        }

        const extra = {
            reply_markup: {
            inline_keyboard: [
                [{ text: "📁 Fayllarni ko'rish", callback_data: `checkAllFiles` }],
                [{ text: "Fayl qo'shish", callback_data: 'addNewFile' }]
                ]
            }   
        }
        if(messageId == null) return mainFunctions.sendMessage(userId, message, extra);
        else return mainFunctions.editMessageText(userId, messageId, message, extra);
    } catch (error) {
        console.log('Problem while back to Menu' + error.message);
    }
}

async function customerMenu(ctx) {
    try {
        const messageId = ctx.update.callback_query.message.message_id;
        const ctxMessage = ctx.update.callback_query;
        const fileId = ctxMessage.message.document.file_id;
        const { from: {id : userId}, message: { message_id: lastMessageId } } = ctxMessage;

        if(await isWho.isMember(userId) == false) {
            const { message, extra } = await errors.subscriptionMessage(ctx);
            await mainFunctions.sendMessage(userId, message, extra);
            return mainFunctions.editMessageMedia(userId, lastMessageId, null, fileId);
        } 

        const files = await downloadFile.readMyFile();
        let result = await dbFunctions.getAllFiles('fileInCustomer', files);
        console.log(4,result);
        const message = "📁 Mavjud fayllar:"
        const extra = {
            reply_markup: {
            inline_keyboard: result[0],
            }
        }
        // const { messageId, message, extra = {} } = await customerMenu(ctxMessage, userId);
        await mainFunctions.sendMessage(userId, message, extra);
        return mainFunctions.editMessageMedia(userId, messageId, null, fileId);
    } catch (error) {
        console.log('Problem while back to Customer Menu' + error.message);
    }
}





module.exports = {
    creatorMenu,
    customerMenu
}