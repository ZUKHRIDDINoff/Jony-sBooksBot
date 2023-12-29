const { getAllFiles } = require('./dbFunctions');


async function customerMenu(ctxMessage) {
    try {
        let result = await getAllFiles('fileInCustomer');
        filesArrayIndexes = result[1];
        const message = "📁 Mavjud fayllar:"
        const messageId = ctxMessage.message.message_id;
        const extra = {
            reply_markup: {
            inline_keyboard: result[0],
            }
        }
        return { messageId, message, extra };
    } catch (error) {
        console.log('Error while customer Menu: ' + error.message);
    }
}

module.exoprts = {
    customerMenu
}