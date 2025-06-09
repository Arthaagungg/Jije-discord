const config = {
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
  users: {
    ownerId: '771528467249365003',
    developers: ['771528467249365003']
  },
  messages: {
    NOT_BOT_OWNER: 'Kamu tidak memiliki izin untuk menjalankan perintah ini karena kamu bukan pemilikku!',
    NOT_BOT_DEVELOPER: 'Kamu tidak memiliki izin untuk menjalankan perintah ini karena kamu bukan developer-ku!',
    NOT_GUILD_OWNER: 'Kamu tidak memiliki izin untuk menjalankan perintah ini karena kamu bukan pemilik server!',
    CHANNEL_NOT_NSFW: 'Kamu tidak bisa menjalankan perintah ini di channel non-NSFW!',
    MISSING_PERMISSIONS: 'Kamu tidak memiliki izin untuk menjalankan perintah ini, ada permission yang kurang.',
    COMPONENT_NOT_PUBLIC: 'Kamu bukan pembuat tombol ini!',
    NOT_DEVELOPER_CHANNEL: 'Kamu tidak bisa menjalankan perintah ini di dalam channel ini, silahkan menjalankan di dalam channel maintenance bot.',
    GUILD_COOLDOWN: 'Kamu sedang dalam masa cooldown, kamu bisa menggunakan perintah ini lagi dalam `%cooldown%s`.'
  },
  bots: [
    {
      name: 'Bot Utama',
      token: process.env.BOT1_TOKEN,
      status: [
        { name: 'Bot Utama Aktif 🤖', type: 0 },
        { name: 'Melayani Server 1', type: 0 }
      ]
    },
    {
      name: 'Bot Kedua',
      token: process.env.BOT2_TOKEN,
      status: [
        { name: 'Bot Kedua Siaga 🛡️', type: 0 },
        { name: 'Online 24/7', type: 0 }
      ]
    }
    // Tambahkan bot lainnya di sini
  ]
};

module.exports = config;
