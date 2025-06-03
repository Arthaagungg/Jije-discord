const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { getUserSocials } = require("../../Handlers/socialsHandler");

const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");

module.exports = new MessageCommand({
    name: "sosmed",

    async run({ message }) {
        const user = message.mentions.users.first() || message.author;
        const isSelf = user.id === message.author.id;

        const socials = await getUserSocials(user.id);

        const embed = new EmbedBuilder()
            .setColor("#00b0f4")
            .setTitle(`🌐 mySosial Media ${user.username}`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setDescription(
                socials.length > 0
                    ? socials.map(s => `• **${s.platform}** → [@${s.username}](https://${s.platform.toLowerCase()}.com/${s.username})`).join("\n")
                    : "*Belum ada sosial media yang ditambahkan.*"
            )
            .setFooter({ text: isSelf ? "Gunakan tombol di bawah untuk mengelola sosial media Anda." : " " });

        const components = [];

        if (isSelf) {
            components.push(new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("sosmed_manage")
                    .setLabel("Kelola Sosial Media")
                    .setEmoji("🛠️")
                    .setStyle(ButtonStyle.Primary)
            ));
        }

        return message.reply({
            embeds: [embed],
            components,
        });
    }
}).toJSON();
