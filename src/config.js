const config = {
  bots: [
    {
      name: "Bot Utama",
      token: process.env.BOT1_TOKEN,
      ownerId: '771528467249365003'
    },
    {
      name: "Bot Kedua",
      token: process.env.BOT2_TOKEN, // Kosongkan ini kalau belum punya customer
      ownerId: '771528467249365003'
    }
  ],

  database: {
    path: './database.yml'
  },

  development: {
    enabled: false,
    guildId: '1381216724027834408'
  },

  commands: {
    prefix: '!',
    message_commands: true,
    application_commands: {
      chat_input: false,
      user_context: false,
      message_context: false
    }
  },

  messages: {
    NOT_BOT_OWNER: 'Kamu bukan pemilik bot!',
    NOT_BOT_DEVELOPER: 'Kamu bukan developer!',
    NOT_GUILD_OWNER: 'Kamu bukan pemilik server!',
    CHANNEL_NOT_NSFW: 'Perintah ini hanya untuk channel NSFW!',
    MISSING_PERMISSIONS: 'Permission kamu tidak cukup!',
    COMPONENT_NOT_PUBLIC: 'Tombol ini bukan milikmu!',
    NOT_DEVELOPER_CHANNEL: 'Perintah ini hanya untuk channel developer!',
    GUILD_COOLDOWN: 'Tunggu %cooldown%s untuk menjalankan perintah ini lagi.'
  }
};

module.exports = config;
