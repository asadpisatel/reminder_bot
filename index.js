require("dotenv").config();
const { Telegraf } = require("telegraf");
const cron = require("node-cron");

const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("ok");
});
server.listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;

// Сообщения
const morningMessages = [
  "Доброе утро! Я на работе, у меня всё хорошо. Как у вас дела?",
  "Всем доброе утро! У меня все хорошо, как у вас дела? Малыш малыш ты идешь в школу, смотришь телевизор, кушаешь.",
  "Доброе утро! У меня все хорошо. Как у вас дела? Я на работе."
];

const eveningMessages = [
  "Я пришел домой, кушаю, не беспокойтесь.",
  "Я пришел домой. Всем доброго вечера. Малыш малыш ты сидишь",
  "У меня всё хорошо. Покушал."
];

const sundayMessages = [
  "Сегодня дома, поспал, делаю дела со стажировкой",
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Утреннее (09:30)
cron.schedule("30 4 * * 1-6", () => {
  bot.telegram.sendMessage(CHAT_ID, getRandom(morningMessages));
});


cron.schedule("15 15 * * 1-6", () => {
  bot.telegram.sendMessage(CHAT_ID, getRandom(eveningMessages));
});


cron.schedule("0 6 * * 0", () => {
  bot.telegram.sendMessage(CHAT_ID, getRandom(sundayMessages));
});


bot.launch();
