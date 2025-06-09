const config = require("../config");

function isMainBot(botId) {
  const mainBotId = config.bots[0]?.clientId; // Bot Utama harus ada clientId
  return botId === mainBotId;
}

module.exports = isMainBot;
