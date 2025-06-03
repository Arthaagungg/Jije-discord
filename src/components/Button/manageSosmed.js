const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");
const { getUserSocials, allowedPlatforms } = require("../../utils/socialManager");

/**
 * @type {import('discord.js').ButtonInteractionHandler}
 */
module.exports = {
  customId: /^sosmed-manage-(\d+)$/,
  type: "button",
  run: async (interaction) => {
    const [, userId] = interaction.customId.match(/^sosmed-manage-(\d+)$/);

    if (interaction.user.id !== userId) {
      return interaction.reply({
        content: "Kamu tidak bisa mengelola sosial media orang lain!",
        ephemeral: true,
      });
    }

    const socials = getUserSocials(userId);

    const embed = new EmbedBuilder()
      .setTitle("Kelola Sosial Media")
      .setColor("Random")
      .setDescription(
        socials.length > 0
          ? "Pilih sosial media yang ingin kamu edit atau hapus."
          : "Kamu belum menambahkan sosial media."
      );

    const menu = new StringSelectMenuBuilder()
      .setCustomId("select-sosmed")
      .setPlaceholder("Pilih sosial media...")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        socials.map((acc) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(`${acc.platform} - ${acc.url}`)
            .setValue(`${acc.platform}|${acc.url}`)
        )
      );

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      embeds: [embed],
      components: socials.length > 0 ? [row] : [],
      ephemeral: true,
    });
  },
};
