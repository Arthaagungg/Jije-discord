const { ButtonInteraction, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
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
        await interaction.deferUpdate(); // pakai deferUpdate karena kita akan editReply

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

        const disabledButton = new ButtonBuilder()
            .setCustomId("sosmed_manage")
            .setLabel("Kelola Sosial Media")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const row1 = new ActionRowBuilder().addComponents(selectMenu);
        const row2 = new ActionRowBuilder().addComponents(disabledButton);

        return interaction.editReply({
            content: "Pilih aksi yang ingin kamu lakukan:",
            components: [row1, row2]
        });
    }
}).toJSON();
