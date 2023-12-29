const fs = require('fs');
const path = require('path');
const { dbFunctions, mainFunctions, errors, downloadFile, isWho } = require('../helper/index');

let filesArrayIndexes = [];
lastFileMessageId = '';

async function checkAllFiles(ctx) {
    try {
        lastFileMessageId = ''
        const ctxMessage = ctx.update.callback_query;
        let fileArray = ''
        const userId = ctxMessage.from.id;

        [ fileArray, filesArrayIndexes ] = await dbFunctions.getAllFiles('fileIn')

        fileArray.push([{
            text: "🔙 Ortga",
            callback_data: `creatorMenu`
        }])
        
        const message = `📁 Sizda mavjud bo'lgan fayllar: ${filesArrayIndexes.length}`
        const extra = {
                reply_markup: {
                inline_keyboard: fileArray
                }
            }

        const messageId = ctxMessage.message.message_id;

        if(ctxMessage.message.document) {
            await mainFunctions.sendMessage(userId, message, extra);
            const fileId = ctxMessage.message.document.file_id;
            return mainFunctions.editMessageMedia(userId, messageId, null, fileId);
        } else {
            return mainFunctions.editMessageText(userId, messageId, message, extra);
        }
    } catch (error) {
        console.log('Problem while checking all files' + error.message);   
    }
};

async function addNewFile(ctx) {
    try {
        const ctxMessage = ctx.update.callback_query;
        const userId = ctxMessage.from.id;
        const message = '📁 Yangi faylni yuboring!';
        const extra = {
            reply_markup: {
            inline_keyboard: [
                [{ text: "🔙 Ortga", callback_data: "creatorMenu"}],
                ]
            }
        }
        const result = await mainFunctions.sendMessage(userId, message, extra);
        lastFileMessageId = result.message_id;

        await mainFunctions.deleteMessage(ctx);
    } catch (error) {
        console.log('Problem while adding new File' + error.message);
    }
}


async function callbackQueryFunc(ctx) {
    try {
        const ctxMessage = ctx.update.callback_query;
        const userId = ctxMessage.from.id;
        let pressedButton = ctx.callbackQuery.data;
        const fileNameArr = pressedButton.split('<>');

        if(fileNameArr[0] == 'fileIn') {
            try {
                const extra = {
                    // caption: "Fayl nomi: file.pdf",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "🗑 O'chirish", callback_data: `deleteFile<>${fileNameArr[1]}` }],
                            // [{ text: "✏️ O'zgaritirish", callback_data: 'updateFile' }],
                            [{ text: "🔙 Ortga", callback_data: 'checkAllFiles' }]
                        ]
                        }
                }
                const messageId = ctxMessage.message.message_id;
                if(ctxMessage.message.document) {
                    const fileId = ctxMessage.message.document.file_id;
                    return mainFunctions.editMessageMedia(userId, messageId, null, fileId, extra);
                } else {
                    const res = await mainFunctions.editMessageText(userId, messageId, "Fayl yuborilmoqda...");
                    await setTimeout(() => {
                        mainFunctions.deleteMessage(ctx, userId, res.message_id);
                        mainFunctions.sendFile(userId, filesArrayIndexes[fileNameArr[1]], extra);
                    }, 1000);
                }
            } catch (error) {
                console.log('Problem while showing single file: ' + error.message);
            }
        }
        else if(fileNameArr[0] == "deleteFile") {
            try {
                const messageId = ctxMessage.message.message_id;
                const fileId = ctxMessage.message.document.file_id;
                const message = "Faylni o'chirishni tasdiqlaysizmi?"
                const extra =  {
                    reply_markup: {
                    inline_keyboard: [
                        [{ text: "Tasdiqlash", callback_data: `deleteFileConfirm<>${fileNameArr[1]}`}],
                        [{ text: "Bekor qilish", callback_data: `fileIn<>${fileNameArr[1]}`}]
                    ]
                    }
                }

                return mainFunctions.editMessageMedia(userId, messageId, message, fileId, extra);
            } catch (error) {
                
            }
        }
        else if(fileNameArr[0] == 'deleteFileConfirm') {
            try {
                await fs.unlinkSync(path.join(__dirname, '..', 'files', `${filesArrayIndexes[fileNameArr[1]]}`));

                const message = "✅ Fayl muvaffaqiyatli o'chirildi!"
                const extra =  {
                    reply_markup: {
                    inline_keyboard: [
                        [{
                        text: "🔙 Ortga",
                        callback_data: 'checkAllFiles'
                        }]
                    ]
                    }
                }

                await mainFunctions.sendMessage(userId, message, extra);
                await mainFunctions.deleteMessage(ctx);

            } catch (error) {
                console.log('Problem with deleting file'+error.message);
            }
        }
        else if(fileNameArr[0] == 'fileInCustomer') {
            try {
                let result = await dbFunctions.getAllFiles('fileInCustomer');
                filesArrayIndexes = result[1];
                
                const messageId = ctxMessage.message.message_id;
                if(await isWho.isMember(userId) == false) {
                    const { message, extra } = await errors.subscriptionMessage(ctx);
                    return mainFunctions.editMessageText(userId, messageId, message, extra);
                }
                const extra = {
                    // caption: "Fayl nomi: file.pdf",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "🔙 Ortga", callback_data: 'customerMenu'}]
                        ]
                        }
                }
                
                const res = await mainFunctions.editMessageText(userId, messageId, "Fayl yuborilmoqda...");
                await setTimeout(() => {
                    mainFunctions.deleteMessage(ctx, userId, res.message_id);
                    mainFunctions.sendFile(userId, filesArrayIndexes[fileNameArr[1]], extra);
                }, 1000);
            } catch (error) {
                console.log('Problem while sending file to customer' + error.message);
            }
        }
    } catch (error) {
        console.log('Error while callbackQueryFunc: ' + error.message);
    }
}

async function documentFunctions(ctx) {
    try {
        const userId = ctx.update.message.from.id;
        const fileId = ctx.update.message.document.file_id;
        let messageId = ctx.update.message.message_id;
        const fileName = ctx.update.message.document.file_name;

        if(lastFileMessageId+1 !== ctx.update.message.message_id){
            return errors.fileDownError(ctx)
        }

        
        const fileLink = await ctx.telegram.getFileLink(fileId);
        const result = await downloadFile.downnloadFl(fileLink, fileName);
        
        if(result) {
            const message = "✅ Fayl muvaffaqiyatli qo'shildi!"
            const extra = {
                // caption: "Fayl nomi: file.pdf",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "📁 Fayllarnii ko'rish", callback_data: `checkAllFiles` }],
                        [{ text: "Yana fayl qo'shish", callback_data: `addNewFile` }],
                    ]
                    }
            }
            await mainFunctions.sendMessage(userId, message, extra);
            await mainFunctions.deleteMessage(ctx, userId, messageId-1);
            return mainFunctions.deleteMessage(ctx);
        }else {
            const message = "Faylni qo'shishda muammo sodir bo'ldi. Qaytadan urinib ko'ring!"
            return await mainFunctions.sendMessage(userId, message);
        }
    } catch (error) {
        console.log('Problem while downloading file!' + error.message);
    }
}

module.exports = {
    checkAllFiles,
    addNewFile,
    callbackQueryFunc,
    documentFunctions
}