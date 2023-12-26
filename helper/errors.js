async function fileDownError(ctx) {
    const message = "❗️ Siz fayl yuborish kerak emas vaqtda, fayl yubordingiz!. Qaytadan fayl qo'shish bo'limiga kirib ko'ring!";
    const extra = {
        reply_markup: {
        inline_keyboard: [
            [{ text: "Fayl qo'shish", callback_data: 'addNewFile' }],
            ]
        }   
    }
    await ctx.reply(message, extra);
}

module.exports = {
    fileDownError
}