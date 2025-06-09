const config = require('../config');

module.exports = function isMainBot(botId) {
  const mainBot = config.bots[0]; // asumsikan bot utama ada di index ke-0
  return botId === mainBot.id;
};
