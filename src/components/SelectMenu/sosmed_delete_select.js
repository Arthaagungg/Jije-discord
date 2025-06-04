const { StringSelectMenuInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Component = require("../../structure/Component");
const DiscordBot = require("../../client/DiscordBot");

module.exports = new Component({
  customId: /^sosmed_delete_select_\d+$/,
  type: "select",

  /**
   * @param {DiscordBot} client
   * @param {StringSelectMenuInteraction} interaction
   */
  run: async (client, interaction) => {
    const selectedId = interaction.values[0];
    const userId = interaction.user.id;

    // Konfirmasi hapus
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`sosmed_confirm_delete_${selectedId}`)
        .setLabel("✅ Ya, hapus")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("sosmed_cancel_delete")
        .setLabel("❌ Batal")
        .setStyle(ButtonStyle.Secondary)
    );

    return interaction.reply({
      content: `⚠️ Yakin ingin menghapus sosial media ini?`,
      components: [row],
      ephemeral: true
    });
  }
}).toJSON();
