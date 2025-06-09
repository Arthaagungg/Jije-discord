const config = {
  bots: [
    {
      token: process.env.CLIENT_TOKEN_1,
      clientId: 'BOT_CLIENT_ID_1', // optional, kalau mau kamu bisa pakai
      name: 'ByteBot A', // nama bot, biar tahu bot mana
      database: {
        path: './database/byteA.yml'
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
      users: {
        ownerId: '771528467249365003',
        developers: ['771528467249365003']
      },
      messages: {
        NOT_BOT_OWNER: 'Kamu tidak memiliki izin untuk menjalankan perintah ini karena kamu bukan pemilikku!',
        NOT_BOT_DEVELOPER: 'Kamu tidak memiliki izin untuk menjalankan perintah ini karena kamu bukan developer-ku!',
        NOT_GUILD_OWNER: 'Kamu bukan pemilik server ini!',
        CHANNEL_NOT_NSFW: 'Perintah ini hanya dapat dijalankan di channel NSFW!',
        MISSING_PERMISSIONS: 'Kamu tidak memiliki izin yang cukup.',
        COMPONENT_NOT_PUBLIC: 'Kamu bukan pembuat tombol ini!',
        NOT_DEVELOPER_CHANNEL: 'Hanya bisa digunakan di channel developer!',
        GUILD_COOLDOWN: 'Kamu sedang cooldown. Coba lagi dalam \`%cooldown%s\`.'
      }
    },
    {
      token: process.env.CLIENT_TOKEN_2,
      name: 'ByteBot B',
      database: {
        path: './database/byteB.yml'
      },
      // config lainnya sesuai kebutuhan
    }
  ]
};

module.exports = config;
