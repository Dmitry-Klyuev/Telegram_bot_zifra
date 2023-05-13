const TelegramBot = require('node-telegram-bot-api');
// const puppeteer = require('puppeteer-core');
require('dotenv').config()
const puppeteer = require('puppeteer')

// Установка токена бота
const token = process.env.TOKEN;
const bot = new TelegramBot('6210059305:AAFqbdBVQG4UzC2RVxNGIy45qvQDmbiy4ts', {polling: true});

// Обработка команды /start
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Добро пожаловать в наш чат!');
});

// Обработка текстовых сообщений
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(msg)
    if (msg.text.includes('moba')) {
        (async () => {
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
            data = data.replace(' ', '');
            const outDataBy = ((data / 77 + 1.5) * 3).toFixed()
            const outDataUSD = ((data / 77 + 1.5)).toFixed()
            await bot.sendMessage(chatId, `Цена с доставкой: ${outDataUSD} USD или ${outDataBy} Бел`);
            await page.close()
            await browser.close()
        })()
    }
});


