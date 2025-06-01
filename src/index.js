require('dotenv').config();
const fs = require('fs');
const express = require('express');
const DiscordBot = require('./client/DiscordBot');

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

// Inisialisasi bot
const client = new DiscordBot();
module.exports = client;

client.connect();

// Tangani error agar tidak crash
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);