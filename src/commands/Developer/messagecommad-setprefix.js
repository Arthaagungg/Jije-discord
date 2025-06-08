const { Message, EmbedBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const MessageCommand = require("../../structure/MessageCommand");
const supabase = require("../../utils/supabase");

module.exports = new MessageCommand({
    command: {
        name: 'setprefix',
        description: 'Atur prefix untuk server ini.',
        aliases: []
    },
    options: {
        cooldown: 5000,
        botDevelopers: true
    },

    /**
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: async (client, message, args) => {
        const prefixBaru = args[0];

        if (!prefixBaru) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('❌ Prefix tidak diberikan')
                .setDescription('Kamu harus menyertakan prefix yang ingin digunakan.')
                .setFooter({ text: 'Pengaturan Prefix', iconURL: message.guild.iconURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });
        }

        if (prefixBaru.length > 5) {
            const embed = new EmbedBuilder()
                .setColor('Red')
                .setTitle('⚠️ Prefix terlalu panjang')
                .setDescription(`Panjang prefix maksimal adalah 5 karakter. Yang kamu masukkan: **${prefixBaru.length} karakter**.`)
                .setFooter({ text: 'Pengaturan Prefix', iconURL: message.guild.iconURL({ dynamic: true }) });

            return message.reply({ embeds: [embed] });
        }

        // Cek apakah sudah ada prefix sebelumnya
        const { data: existing, error } = await supabase
            .from("prefixes")
            .select("*")
            .eq("guild_id", message.guild.id)
            .single();

        let embed;
        if (existing) {
            // Update prefix
            const { error: updateError } = await supabase
                .from("prefixes")
                .update({ prefix: prefixBaru })
                .eq("guild_id", message.guild.id);

            if (updateError) {
                console.error(updateError);
                embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('❌ Gagal memperbarui prefix')
                    .setDescription('Terjadi kesalahan saat memperbarui prefix di database.');
            } else {
                embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('✅ Prefix Diperbarui')
                    .setDescription(`Prefix berhasil diubah menjadi \`${prefixBaru}\`.`);
            }
        } else {
            // Insert prefix
            const { error: insertError } = await supabase
                .from("prefixes")
                .insert([{ guild_id: message.guild.id, prefix: prefixBaru }]);

            if (insertError) {
                console.error(insertError);
                embed = new EmbedBuilder()
                    .setColor('Red')
                    .setTitle('❌ Gagal menyimpan prefix')
                    .setDescription('Terjadi kesalahan saat menyimpan prefix di database.');
            } else {
                embed = new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('✅ Prefix Disimpan')
                    .setDescription(`Prefix berhasil disetel ke \`${prefixBaru}\`.`);
            }
        }

        embed.setFooter({ text: 'Pengaturan Prefix', iconURL: message.guild.iconURL({ dynamic: true }) });
        await message.reply({ embeds: [embed] });
    }
}).toJSON();
