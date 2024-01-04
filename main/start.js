const { isWho, mainFunctions, errors, downloadFile } = require('../helper/index');
const { getAllFiles } = require('../helper/dbFunctions');
const Actions = require('../actions/index')
async function start(ctx) {
    try {
        const userId = ctx.message.from.id;
        if(await isWho.isAdmin(userId) || await isWho.isCreator(userId)) {
            return Actions.menuActions.creatorMenu(ctx, userId);
        }
        else if(await isWho.isMember(userId) ) {
            const files = await downloadFile.readMyFile();
            let result = await getAllFiles('fileInCustomer', files);
            filesArrayIndexes = result[1];
            const message = "📁 Mavjud fayllar:"
            const extra = {
                reply_markup: {
                inline_keyboard: result[0],
                }
            }
            return mainFunctions.sendMessage(userId, message, extra);
        } else {
            const { message, extra } = await errors.subscriptionMessage(ctx);
            return mainFunctions.sendMessage(userId, message, extra);
        }
    } catch (error) {
        console.log('Error with start button' + error.message);
    }
}

module.exports = {
    start
}