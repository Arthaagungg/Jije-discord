const { ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

/**
 * @param {DiscordBot} client 
 * @param {ButtonInteraction} interaction 
 */
module.exports = new Component({
    customId: "sosmed_manage",
    type: "button",

    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("sosmed_action_menu")
            .setPlaceholder("Pilih aksi sosial media")
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("Tambah Sosial Media")
                    .setValue("add")
                    .setEmoji("➕"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Edit Sosial Media")
                    .setValue("edit")
                    .setEmoji("✏️"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("Hapus Sosial Media")
                    .setValue("delete")
                    .setEmoji("🗑️")
            );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        return interaction.editReply({
            content: "Pilih aksi yang ingin kamu lakukan:",
            components: [row]
        });
    }
}).toJSON();
