require('dotenv').config();
const fs = require('fs');
const express = require('express');
const DiscordBot = require('./client/DiscordBot');
const config = require('./config');

// Clear terminal log
fs.writeFileSync('./terminal.log', '', 'utf-8');

// Buat server Express untuk keep-alive
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive and running!');
});

app.listen(PORT, () => {
  console.log(`Keep-alive server running on port ${PORT}`);
});

// Multi-bot launcher
const bots = [];

for (const botConfig of config.bots) {
  const bot = new DiscordBot(botConfig);
  bots.push(bot);
  bot.connect();
}

// Optional: export semua bot
module.exports = bots;

// Tangani error global
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
