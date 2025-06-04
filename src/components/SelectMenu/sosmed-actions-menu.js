const {
  StringSelectMenuInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const socialManager = require("../../utils/socials");

module.exports = new Component({
  customId: "sosmed_action_menu",
  type: "select",

  /**
   * @param {DiscordBot} client
   * @param {StringSelectMenuInteraction} interaction
   */
  run: async (client, interaction) => {
    const selected = interaction.values[0];
    const userId = interaction.user.id;

    if (selected === "add") {
      const modal = new ModalBuilder()
        .setCustomId("sosmed_modal_add")
        .setTitle("Tambah Sosial Media")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("platform")
              .setLabel("Nama Sosial Media (tiktok, instagram, x)")
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("tiktok")
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("username")
              .setLabel("Username")
              .setStyle(TextInputStyle.Short)
              .setPlaceholder("Hanya username, tanpa link")
              .setRequired(true)
          )
        );

      await interaction.showModal(modal);
    }

    else if (selected === "edit") {
      const socials = await socialManager.getUserSocials(userId);

      if (!socials || socials.length === 0) {
        return interaction.reply({
          content: "❌ Kamu belum punya sosial media untuk diedit.",
          ephemeral: true
        });
      }

      const modal = new ModalBuilder()
        .setCustomId("sosmed_modal_edit")
        .setTitle("Edit Sosial Media");

      const components = socials.slice(0, 5).map((social, idx) =>
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(`edit_${social.platform}_${idx}`)
            .setLabel(`${social.platform} (sekarang: ${social.username})`)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        )
      );

      modal.addComponents(...components);

      await interaction.showModal(modal);
    }

    else if (selected === "delete") {
      return interaction.reply({
        content: "❌ Fitur hapus sosial media sedang dalam pengembangan.",
        ephemeral: true
      });
    }
  }
}).toJSON();
