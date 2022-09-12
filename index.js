const { Telegraf } = require('telegraf');
const fs = require('fs');
const axios = require('axios');
require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);

bot.start(ctx => ctx.reply('Start...'));
bot.help(ctx => ctx.reply('Help...'));

//#region COMANDOS PERSONALIZADOS

function random(number){ return Math.floor(Math.random() * (number + 1)); }

bot.command('random', ctx => ctx.reply(random(100)));

bot.command('advancerandom', ctx => {
    const message = ctx.update.message.text;
    const randomNumber = Number(message.split(' ')[1]);

    if(isNaN(randomNumber) || randomNumber <= 0) return ctx.reply('Por favor, luego de /advancerandom escribe un numero mayor de 0.')
    else return ctx.reply(random(randomNumber));

});

bot.command('sendphoto', ctx =>  ctx.replyWithPhoto({source: './src/img/res.png'}));

//#endregion


//#region EVENTOS

const downloadImage = (url, image_path, ctx) => {
    axios({ url, responseType: "stream" }).then((response) => {
        new Promise((resolve, reject) => {
            response.data
             .pipe(fs.createWriteStream(image_path))
             .on("finish", () => {
                ctx.reply("Imagen guardada correctamente");
                resolve();
             })
             .on("error", (e) => {
                ctx.reply("Ocurrió un error al intentar guardar la imagen. Intenta de nuevo.");
                reject(e);
             });
        })
    });
}

bot.on('photo', ctx => {
    const fileId = ctx.update.message.photo[3].file_id;

    ctx.telegram.getFileLink(fileId).then((response) => {
        downloadImage(response.href, './src/img/photo.png', ctx);
    });

});

//#endregion

bot.launch();