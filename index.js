require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("ok");
});
server.listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;
const ALLOWED_USER_ID = parseInt(process.env.ALLOWED_USER_ID);

const morningMessages = [
  "Доброе утро! Я на работе, у меня всё хорошо. Как у вас дела?",
  "Всем доброе утро! У меня все хорошо, как у вас дела? Малыш малыш ты идешь в школу, смотришь телевизор, кушаешь.",
  "Доброе утро! У меня все хорошо. Как у вас дела? Дили, Эли, Малыш, Мама? Я на работе."
];

const eveningMessages = [
  "Я пришел домой, кушаю, не беспокойтесь.",
  "Я пришел домой. Всем доброго вечера. Малыш малыш ты сидишь. Я покушал.",
  "У меня всё хорошо. Покушал. Пришел домой."
];

const sundayMessages = [
  "Сегодня дома, поспал, делаю дела со стажировкой",
  "Всем привет! Сегодня дома, отдыхаю, как ваши дела?"
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const privateKeyboard = Markup.keyboard([
  ['Утро', 'Вечер'],
  ['Sunday']
]).resize().oneTime();

function isAllowedUser(userId) {
  return userId === ALLOWED_USER_ID;
}

bot.use(async (ctx, next) => {
  const chatId = ctx.chat?.id;
  const userId = ctx.from?.id;
  
  if (chatId && String(chatId) === String(CHAT_ID)) {
    return; 
  }
  
  if (ctx.chat.type !== 'private') {
    return;
  }
  
  if (!isAllowedUser(userId)) {
    return; 
  }
  
  return next();
});

bot.start((ctx) => {
  ctx.reply('Выберите время:', privateKeyboard);
});

bot.hears(['Утро', 'Вечер', 'Sunday'], async (ctx) => {
  let message;
  
  switch (ctx.message.text) {
    case 'Утро':
      message = getRandom(morningMessages);
      break;
    case 'Вечер':
      message = getRandom(eveningMessages);
      break;
    case 'Sunday':
      message = getRandom(sundayMessages);
      break;
  }
  
  if (message) {
    try {
      await bot.telegram.sendMessage(CHAT_ID, message);
    } catch (error) {
      console.error('Ошибка при отправке сообщения в группу:', error);
    }
  }
  
  ctx.reply('Выберите время:', privateKeyboard);
})

bot.launch();

console.log('Бот запущен!');

process.on('warning', (warning) => {
  if (warning.name === 'DeprecationWarning' && warning.message.includes('punycode')) {
    return;
  }
  console.warn(warning.name, warning.message);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));