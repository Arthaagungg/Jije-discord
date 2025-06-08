const config = {
    database: {
        path: './database.yml' // Lokasi file database yang digunakan bot.
    },
    development: {
        enabled: false, // Jika true, bot akan mendaftarkan semua perintah hanya ke server tertentu (bukan global).
        guildId: '1381216724027834408' // ID server tujuan untuk mode pengembangan.
    },
    commands: {
        prefix: '!', // Prefix untuk perintah berbasis pesan. Dapat diubah melalui database.
        message_commands: true, // Jika true, bot akan mengizinkan perintah melalui pesan (prefix command).
        application_commands: {
            chat_input: false, // Jika true, bot akan mengizinkan perintah berbasis slash (/).
            user_context: false, // Jika true, bot akan mengizinkan perintah dari menu konteks pengguna.
            message_context: false // Jika true, bot akan mengizinkan perintah dari menu konteks pesan.
        }
    },
    users: {
        ownerId: '771528467249365003', // ID pemilik bot (kamu).
        developers: ['771528467249365003'] // Daftar ID developer bot, pastikan ID kamu termasuk di sini.
    },
    messages: { // Konfigurasi pesan balasan saat menjalankan perintah.
        NOT_BOT_OWNER: 'Kamu tidak memiliki izin untuk menjalankan perintah ini karena kamu bukan pemilikku!',
        NOT_BOT_DEVELOPER: 'Kamu tidak memiliki izin untuk menjalankan perintah ini karena kamu bukan developer-ku!',
        NOT_GUILD_OWNER: 'Kamu tidak memiliki izin untuk menjalankan perintah ini karena kamu bukan pemilik server!',
        CHANNEL_NOT_NSFW: 'Kamu tidak bisa menjalankan perintah ini di channel non-NSFW!',
        MISSING_PERMISSIONS: 'Kamu tidak memiliki izin untuk menjalankan perintah ini, ada permission yang kurang.',
        COMPONENT_NOT_PUBLIC: 'Kamu bukan pembuat tombol ini!',
        NOT_DEVELOPER_CHANNEL: 'Kamu tidak bisa menjalankan perintah ini di dalam channel ini, silahkan menjalankan di dalam channel maintenance bot.',
        GUILD_COOLDOWN: 'Kamu sedang dalam masa cooldown, kamu bisa menggunakan perintah ini lagi dalam \`%cooldown%s\`.'
    }
}

module.exports = config;
