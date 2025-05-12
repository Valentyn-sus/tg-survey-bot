const http = require('http');
const express = require('express');
const app = express();

// Запускаем сервер (Render будет считать, что это сервис, слушающий порт)
const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port 3000');
});




require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Replace with your bot token
const token = process.env.BOT_TOKEN
const bot = new TelegramBot(token, { polling: true });

const questions = require('./questions.json');
const answersFile = './answers.json';

const userStates = {};

// Helper: save answers to a file
function saveAnswer(userId, answerData) {
  let existing = {};
  if (fs.existsSync(answersFile)) {
    existing = JSON.parse(fs.readFileSync(answersFile));
  }
  existing[userId] = answerData;
  fs.writeFileSync(answersFile, JSON.stringify(existing, null, 2));
}

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userStates[chatId] = { currentQuestion: 0, answers: [] };

  bot.sendMessage(chatId, 'Welcome! Would you like to take a short survey?', {
    reply_markup: {
      keyboard: [['Yes', 'No']],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
});

// Handle answers
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!userStates[chatId]) return;

  const state = userStates[chatId];

  // Survey declined
  if (state.currentQuestion === 0 && text.toLowerCase() === 'no') {
    bot.sendMessage(chatId, 'No problem. Have a great day!');
    delete userStates[chatId];
    return;
  }

  // Continue or start survey
  if (state.currentQuestion > 0) {
    state.answers.push(text);
  }

  if (state.currentQuestion < questions.length) {
    bot.sendMessage(chatId, questions[state.currentQuestion]);
    state.currentQuestion++;
  } else {
    saveAnswer(chatId, state.answers);
    bot.sendMessage(chatId, 'Thanks! Your answers have been recorded.');
    delete userStates[chatId];
  }
});
