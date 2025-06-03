const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
    customId: 'sosmed_select',
    type: 'select',

    /**
     * @param {DiscordBot} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        const action = interaction.values[0];

        const modal = new ModalBuilder()
            .setCustomId(`sosmed_${action}`)
            .setTitle(`${action[0].toUpperCase() + action.slice(1)} Sosial Media`);

        const input1 = new TextInputBuilder()
            .setCustomId("platform")
            .setLabel("Nama Platform (contoh: TikTok)")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const input2 = new TextInputBuilder()
            .setCustomId("username")
            .setLabel("Username (contoh: @namaanda)")
            .setStyle(TextInputStyle.Short)
            .setRequired(action !== "delete");

        modal.addComponents(
            new ActionRowBuilder().addComponents(input1),
            new ActionRowBuilder().addComponents(input2)
        );

        await interaction.showModal(modal);
    }
}).toJSON();
