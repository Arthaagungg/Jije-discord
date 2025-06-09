require('dotenv').config();
const fs = require('fs');
const express = require('express');
const DiscordBot = require('./client/DiscordBot');
const config = require('./config');

// Bersihkan terminal.log
fs.writeFileSync('./terminal.log', '', 'utf-8');

// Setup server Express untuk keep-alive
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bot is alive and running!');
});

app.listen(PORT, () => {
  console.log(`Keep-alive server running on port ${PORT}`);
});

// Simpan semua instance bot di sini
const bots = [];

// Jalankan semua bot dari config
for (const botConfig of config.bots) {
  if (!botConfig.token ) {
    console.warn(`⚠️  Token tidak valid atau kosong untuk bot "${botConfig.name}", dilewati.`);
    continue;
  }

  const client = new DiscordBot(botConfig); // berikan konfigurasi spesifik bot
  bots.push(client);
  client.connect();
}

// Tangani error agar tidak crash
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

// Optional: Export semua bots jika perlu digunakan di luar
module.exports = bots;
