const { Message, EmbedBuilder, AttachmentBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const config = require("../../config");
const supabase = require("../../utils/supabase");

module.exports = new MessageCommand({
    command: {
        name: "adddeveloper",
        description: "Menambahkan developer baru ke dalam database Supabase.",
        aliases: []
    },

    /**
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const embed = new EmbedBuilder().setColor("Red");

        if (message.author.id !== config.users.ownerId) {
            embed.setDescription("❌ Kamu bukan owner bot.");
            return message.reply({ embeds: [embed] });
        }

        const mention = message.mentions.users.first();
        if (!mention) {
            embed.setDescription("❗ Mention user yang ingin dijadikan developer.");
            return message.reply({ embeds: [embed] });
        }

        const guildId = message.guild?.id;
        if (!guildId) {
            embed.setDescription("❗ Gagal mendeteksi guild ID.");
            return message.reply({ embeds: [embed] });
        }

        const { data: existing } = await supabase
            .from("developers")
            .select("*")
            .eq("user_id", mention.id)
            .eq("guild_id", guildId)
            .single();

        if (existing) {
            embed.setDescription("⚠️ User tersebut sudah terdaftar sebagai developer di server ini.");
            return message.reply({ embeds: [embed] });
        }

        const { error: insertError } = await supabase
            .from("developers")
            .insert({
                user_id: mention.id,
                guild_id: guildId
            });

        if (insertError) {
            console.error(insertError);
            embed.setDescription("❌ Gagal menambahkan developer ke database.");
            return message.reply({ embeds: [embed] });
        }

        const successEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Developer Ditambahkan")
            .setDescription(`Berhasil menambahkan <@${mention.id}> sebagai developer untuk server ini.\n\n🔄 Sekarang bot akan melakukan reload handler dan command...`);

        await message.reply({ embeds: [successEmbed] });

        try {
            client.commands_handler.reload();
            client.components_handler.load();
            client.events_handler.load();

            await client.commands_handler.registerApplicationCommands(config.development);

            const reloadEmbed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("✅ Reload Berhasil")
                .setDescription("Semua handler dan command berhasil dimuat ulang.");

            await message.channel.send({ embeds: [reloadEmbed] });

        } catch (err) {
            console.error(err);

            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("❌ Gagal Reload")
                .setDescription("Terjadi kesalahan saat melakukan reload handler/command.")
                .setFooter({ text: "Lihat lampiran di bawah untuk detail error." });

            await message.channel.send({
                embeds: [errorEmbed],
                files: [new AttachmentBuilder(Buffer.from(`${err}`, 'utf-8'), { name: 'error.log' })]
            });
        }
    }
});
