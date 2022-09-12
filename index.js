const { Telegraf } = require('telegraf');
const fs = require('fs');
const axios = require('axios');
require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);

bot.start((ctx) => {
    ctx.replyWithMarkdown(`Hola _${ctx.update.message.from.username}_, este es un bot de demostración.\nPodés ver mis comandos disponibles escribiendo */comandos*
              \nSi precisás tu propio bot de Telegram, podés ver las vías de contacto escribiendo */contacto*
              \n*https://franciscososa.net/*`);
}); 


//#region COMANDOS PERSONALIZADOS

bot.command('comandos', (ctx) => {
    ctx.replyWithMarkdown(`*/start*: información básica del bot.
                         \n*/contacto*: muestra las vías de contacto.
                         \n*/random <número>*: retorna un valor al azar entre 0 y el número escrito.
                         \n*/imagen*: envía una imagen al azar.`)
});

bot.command('contacto', (ctx) => {
    ctx.replyWithMarkdown(`➡ *instagram*.franciscososa.net
                         \n➡ *twitter*.franciscososa.net
                         \n➡ *telegram*.franciscososa.net
                         \n➡ *discord*.franciscososa.net
                         \nhttps://franciscososa.net/#contacto`)
});

function random(number){ return Math.floor(Math.random() * (number +1)) };
bot.command('random', ctx => {
    const message = ctx.update.message.text;
    const randomNumber = Number(message.split(' ')[1]);

    if(isNaN(randomNumber) || randomNumber <= 0) return ctx.reply('Luego de /random, escribir un número mayor a 0.')
    else return ctx.reply(random(randomNumber));

});


bot.command('imagen', (ctx) => ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' }));



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