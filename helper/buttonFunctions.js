const { getAllFiles } = require('./dbFunctions');
const downloadFile  = require('./downloadFile')

async function customerMenu(ctxMessage) {
    try {
        const files = await downloadFile.readMyFile();

        let result = await getAllFiles('fileInCustomer', files);
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