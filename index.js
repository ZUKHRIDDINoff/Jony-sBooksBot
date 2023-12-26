const { Telegraf } = require('telegraf');
const fs = require('fs');
const config = require('config')
const path = require('path');
const downloadFile = require('./downloadFile')
const { isAdmin, isCreator, isMember } = require('./helper/isWho');
const { getAllFiles } = require('./helper/getAllFiles');
const { fileDownError } = require('./helper/errors');
const bot = new Telegraf(config.get('TELEGRAM_BOT_TOKEN'));
const channelUsername = config.get("TELEGRAM_CHANNEL_USERNAME");

let lastFileMessageId = '';
let filesArrayIndexes = [];

bot.start(async ctx => {
    try {
        const userId = ctx.message.from.id;
        if(await isAdmin(userId) || await isCreator(userId)) {
            return creatorMenu(ctx, userId);
        }
        else if(await isMember(userId) ) {
            return customerMenu(ctx, userId)
        } else {
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
            
            return  sendMessage(userId, message, extra);
        }
    } catch (error) {
        console.log('Error with start button' + error.message);
    }
})
bot.action('checkAllFiles', async ctx => {
    try {
        const ctxMessage = ctx.update.callback_query;
        let fileArray = ''
        const userId = ctxMessage.from.id;

        [ fileArray, filesArrayIndexes ] = await getAllFiles('fileIn')

            fileArray.push([{
                text: "🔙 Ortga",
                callback_data: `backToMenu`
            }])
            
            const message = "Sizda mavjud bo'lgan fayllar:"
            const extra = {
                    reply_markup: {
                    inline_keyboard: fileArray
                    }
                }
            await sendMessage(userId, message, extra);
            await deleteMessage(ctx);
    } catch (error) {
        console.log('Problem while checking all files' + error.message);   
    }
})

bot.action('backToMenu', async ctx => {
    try {
        const ctxMessage = ctx.update.callback_query;
        await creatorMenu(ctx, ctxMessage.from.id);
    } catch (error) {
        console.log('Problem while back to Menu' + error.message);
    }
});

bot.action('backToCustomerMenu', async ctx => {
    try {
        const ctxMessage = ctx.update.callback_query;
        await customerMenu(ctx, ctxMessage.from.id);
    } catch (error) {
        console.log('Problem while back to Customer Menu' + error.message);
    }
})

bot.action('checkSubscription', async (ctx) => {
    try {
        const ctxMessage = ctx.update.callback_query;   

        if (await isMember(ctxMessage.from.id)) {
            await customerMenu(ctx, ctxMessage.from.id);
            return deleteMessage(ctx);
        }
    
        const message = "❌ Kechirasiz botdan foydalanish uchun quyidagi kanalga a'zo bolishingizni so'raymiz."
        const extra = {
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

        await sendMessage(ctxMessage.from.id, message, extra);
        await deleteMessage(ctx)
        
    } catch (error) {
        console.log('Problem while checking subscription' + error.message);
    }
    
  })

bot.action('addNewFile', async ctx => {
    try {
        const ctxMessage = ctx.update.callback_query;
        const userId = ctxMessage.from.id;
        const message = '📁 Yangi faylni yuboring!';
        const extra = {
            reply_markup: {
            inline_keyboard: [
                [{ text: "🔙 Ortga", callback_data: "backToMenu"}],
                ]
            }   
        }
        const result = await sendMessage(userId, message, extra);
        lastFileMessageId = result.message_id;

        await deleteMessage(ctx);
    } catch (error) {
        console.log('Problem while adding new File' + error.message);
    }
})

bot.on('document', async ctx => {
        try {
            const userId = ctx.update.message.from.id;
            const fileId = ctx.message.document.file_id;
            const fileName = ctx.update.message.document.file_name;

            if(lastFileMessageId+1 !== ctx.update.message.message_id){
                return fileDownError(ctx)
            }

            
            const fileLink = await ctx.telegram.getFileLink(fileId);
            const result = await downloadFile.downnloadFl(fileLink, fileName);
            
            if(result) {
                const message = "✅ Fayl muvaffaqiyatli qo'shildi!"
                const extra = {
                    // caption: "Fayl nomi: file.pdf",
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: "Fayllarnii ko'rish", callback_data: `checkAllFiles` }],
                            [{ text: "Yana fayl qo'shish", callback_data: `addNewFile` }],
                        ]
                        }
                }
                await sendMessage(userId, message, extra);
                await deleteMessage(ctx)
            }else {
                const message = "Faylni qo'shishda muammo sodir bo'ldi. Qaytadan urinib ko'ring!"
                return await sendMessage(userId, message);
            }
        } catch (error) {
            console.log('Problem while downloading file!' + error.message);
        }
})

// Callback functions
bot.on('callback_query', async ctx => {
    const userId = ctx.update.callback_query.from.id;
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
            await sendFile(userId, filesArrayIndexes[fileNameArr[1]], extra);
            await deleteMessage(ctx);
        } catch (error) {
            console.log('Problem while showing single file' + error.message);
        }
    }
    else if(fileNameArr[0] == "deleteFile") {
        try {
            deleteMessage(ctx);
            const message = "Faylni o'chirishni tasdiqlaysizmi?"
            const extra =  {
                reply_markup: {
                inline_keyboard: [
                    [{ text: "Tasdiqlash", callback_data: `deleteFileConfirm<>${fileNameArr[1]}`}],
                    [{ text: "Bekor qilish", callback_data: `fileIn<>${fileNameArr[1]}`}]
                ]
                }
            }

            await sendMessage(userId, message, extra);
        } catch (error) {
            
        }
    }
    else if(fileNameArr[0] == 'deleteFileConfirm') {
        try {
            await fs.unlinkSync(path.join(__dirname) + `/files/${filesArrayIndexes[fileNameArr[1]]}`);

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

            await sendMessage(userId, message, extra);
            await deleteMessage(ctx);

        } catch (error) {
            console.log('Problem with deleting file'+error.message);
          }
    }
    else if(fileNameArr[0] == 'fileInCustomer') {
        try {
            const extra = {
                // caption: "Fayl nomi: file.pdf",
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🔙 Ortga", callback_data: 'backToCustomerMenu'}]
                    ]
                    }
            }
            await sendFile(userId, filesArrayIndexes[fileNameArr[1]], extra);
        } catch (error) {
            console.log('Problem while sending file to customer' + error.message);
        }
    }
})

async function creatorMenu(ctx,userId) {
    const message = "Administrator paneliga xush kelibsiz. \nMenyudan birini tanglang:"
    const extra = {
        reply_markup: {
        inline_keyboard: [
            [{ text: "Fayllarni ko'rish", callback_data: `checkAllFiles` }],
            [{ text: "Fayl qo'shish", callback_data: 'addNewFile' }]
            ]
        }   
    }
    await sendMessage(userId, message, extra);
    await deleteMessage(ctx);
}


async function customerMenu(ctx, userId) {
    let result = await getAllFiles('fileInCustomer');
    filesArrayIndexes = result[1];
    const message = "Mavjud fayllar:"
    const extra = {
        reply_markup: {
        inline_keyboard: result[0],
        }
    }

    await sendMessage(userId, message, extra);
}
// Delete message
function deleteMessage(ctx) {
    try {
        ctx.deleteMessage();        
    } catch (error) {
        console.log('Problem while deleting message or file' + error.message);
    }
}

// Send message to user
async function sendMessage(chatId, message, extra = {}) {
    const result = await bot.telegram.sendMessage(chatId, message, extra);
    return result;
}

// Send file to user
async function sendFile(userId, fileName, extra = {}) {
    try {
        const filePath = path.join(__dirname)+`/files/${fileName}`;
        lastFileId = await bot.telegram.sendDocument(userId,{ source: fs.readFileSync(filePath), filename: `${fileName}`}, extra);

    } catch (error) {
        console.log('Error with sending file' + error.message);
    }
}




bot.launch();