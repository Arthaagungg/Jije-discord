const { Message } = require("discord.js");
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
        // Hanya owner yang bisa menjalankan command ini
        if (message.author.id !== config.users.ownerId) {
            return message.reply("❌ Kamu bukan owner bot.");
        }

        const mention = message.mentions.users.first();
        if (!mention) {
            return message.reply("❗ Mention user yang ingin dijadikan developer.");
        }

        // Cek apakah user sudah ada di database
        const { data: existing, error: fetchError } = await supabase
            .from("developers")
            .select("*")
            .eq("user_id", mention.id)
            .single();

        if (existing) {
            return message.reply("⚠️ User tersebut sudah terdaftar sebagai developer.");
        }

        const { error: insertError } = await supabase
            .from("developers")
            .insert({ user_id: mention.id });

        if (insertError) {
            console.error(insertError);
            return message.reply("❌ Gagal menambahkan developer ke database.");
        }

        message.reply(`✅ Berhasil menambahkan <@${mention.id}> sebagai developer.`);
    }
});
