require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");

const http = require("http");
const server = http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain"});
  res.end("ok");
});
server.listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);
const CHAT_ID = process.env.CHAT_ID;
const ADMIN_ID = process.env.YOUR_TELEGRAM_USER_ID; 

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

const keyboard = Markup.keyboard([
  ['Утро', 'Вечер'],
  ['Sunday']
]).resize();

bot.use((ctx, next) => {
    if (ctx.from.id !== ADMIN_ID && String(ctx.chat.id) === String(CHAT_ID)) {
        return;
    }
    return next();
});

bot.start((ctx) => {
  if (ctx.from.id === ADMIN_ID) {
    ctx.reply('Привет! Выберите время для отправки сообщения:', keyboard);
  }
});

bot.hears('Утро', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  try {
    const message = getRandom(morningMessages);
    bot.telegram.sendMessage(CHAT_ID, message); 
    ctx.reply('✅ Утреннее сообщение отправлено в группу!', keyboard);
  } catch (error) {
    console.error('Ошибка при отправке утреннего сообщения:', error);
    ctx.reply('❌ Произошла ошибка при отправке сообщения', keyboard);
  }
});

bot.hears('Вечер', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  try {
    const message = getRandom(eveningMessages);
    bot.telegram.sendMessage(CHAT_ID, message);
    ctx.reply('✅ Вечернее сообщение отправлено в группу!', keyboard);
  } catch (error) {
    console.error('Ошибка при отправке вечернего сообщения:', error);
    ctx.reply('❌ Произошла ошибка при отправке сообщения', keyboard);
  }
});

bot.hears('Sunday', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  try {
    const message = getRandom(sundayMessages);
    bot.telegram.sendMessage(CHAT_ID, message);
    ctx.reply('✅ Воскресное сообщение отправлено в группу!', keyboard);
  } catch (error) {
    console.error('Ошибка при отправке воскресного сообщения:', error);
    ctx.reply('❌ Произошла ошибка при отправке сообщения', keyboard);
  }
});

bot.on('text', (ctx) => {
  if (ctx.from.id !== ADMIN_ID) return;
  if (!['Утро', 'Вечер', 'Sunday'].includes(ctx.message.text)) {
    ctx.reply('Пожалуйста, используйте кнопки для выбора времени отправки:', keyboard);
  }
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
