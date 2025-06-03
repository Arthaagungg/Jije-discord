const { ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
    customId: 'manage_sosmed',
    type: 'button',

    /**
     * @param {DiscordBot} client 
     * @param {import("discord.js").ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {
        const menu = new StringSelectMenuBuilder()
            .setCustomId("sosmed_select")
            .setPlaceholder("Pilih tindakan")
            .addOptions([
                { label: "Tambah Sosmed", value: "add", emoji: "🟢" },
                { label: "Edit Sosmed", value: "edit", emoji: "🟡" },
                { label: "Hapus Sosmed", value: "delete", emoji: "🔴" }
            ]);

        const row = new ActionRowBuilder().addComponents(menu);

        await interaction.reply({
            content: "Silakan pilih tindakan yang ingin dilakukan:",
            components: [row],
            ephemeral: true
        });
    }
}).toJSON();
