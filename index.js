const TelegramBot = require('node-telegram-bot-api');
// const puppeteer = require('puppeteer-core');
require('dotenv').config()
const puppeteer = require('puppeteer')

// Установка токена бота
const token = process.env.TOKEN;
const bot = new TelegramBot(token, {polling: true});

// Обработка команды /start
bot.onText(/\/start/, async (msg) => {
    await bot.sendSticker(msg.chat.id, 'https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/192/1.webp');
    await bot.sendMessage(msg.chat.id, 'Добро пожаловать в наш чат!');
});

// Обработка текстовых сообщений
bot.on('message', async (msg) => {
    try{
        const chatId = msg.chat.id;
        console.log(msg)
        if (msg.text.includes('moba')) {
            const browser = await puppeteer.launch({
                headless: "new"
            })
            const page = await browser.newPage()
            await page.goto(msg.text)
            await page.waitForSelector('span.price_value')
            await page.setViewport({width: 1080, height: 1024});
            await page.screenshot({path: 'example.png'})
            await page.$eval('span.price_value', (el) => {
                return console.log(el.textContent)
            })
            let data = await page.evaluate(selector => {
                return document.querySelector(selector).innerText;
            }, '.price_value');
            let name = await page.evaluate(selector => {
                return document.querySelector(selector).innerText
            }, '#pagetitle');
            data = data.replace(' ', '');
            const outDataBy = ((data / 77 + 1.5) * 3).toFixed()
            const outDataUSD = ((data / 77 + 1.5)).toFixed()
            await bot.sendMessage(chatId, `Ты спрашивал: ${name} \nЦена с доставкой: ${outDataUSD} USD или ${outDataBy} Бел`);
            await page.close()
            await browser.close()
            return

        }

    }
    catch (e){
        console.log(e)
    }
    return bot.sendMessage(chatId, 'Я пока работаю только с сайтом moba.ru')
})


