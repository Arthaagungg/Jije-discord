const {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  EmbedBuilder,
} = require("discord.js");
const { getUserSocials } = require("../../utils/socialManager");
const Component = require("../../structure/Component");

module.exports = new Component({
  customId: "sosmed-manage",
  type: "button",

  /**
   * @param {import("../../client/DiscordBot")} client
   * @param {import("discord.js").ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    const userId = interaction.user.id;
    const socials = getUserSocials(userId);

    const embed = new EmbedBuilder()
      .setTitle("Kelola Sosial Media")
      .setColor("Random")
      .setDescription(
        socials.length > 0
          ? "Pilih sosial media yang ingin kamu edit atau hapus."
          : "Kamu belum menambahkan sosial media."
      );

    if (socials.length === 0) {
      return interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    const menu = new StringSelectMenuBuilder()
      .setCustomId("select-sosmed")
      .setPlaceholder("Pilih sosial media...")
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
      components: [row],
      ephemeral: true,
    });
  },
}).toJSON();
