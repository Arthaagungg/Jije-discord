const {
  StringSelectMenuInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const socialManager = require('../../utils/socials');

module.exports = new Component({
  customId: /^sosmed_action_menu_\d+$/, // regex support
  type: "select",

  /**
   * @param {DiscordBot} client
   * @param {StringSelectMenuInteraction} interaction
   */
  run: async (client, interaction) => {
    const selected = interaction.values[0];
    const userId = interaction.user.id;

    // ⛔️ Validasi: hanya user yg sesuai ID di customId boleh akses
    const targetId = interaction.customId.replace("sosmed_action_menu_", "");
    if (userId !== targetId) {
      return interaction.reply({
        content: "❌ Ini bukan menu milik kamu.",
        ephemeral: true
      });
    }

    // ✅ Handler: Tambah Sosmed
    if (selected === "add") {
      const modal = new ModalBuilder()
        .setCustomId("sosmed_modal_add")
        .setTitle("Tambah Sosial Media")
        .addComponents(
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("platform")
              .setLabel("Platform (tiktok, instagram, x)")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          ),
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId("username")
              .setLabel("Username")
              .setStyle(TextInputStyle.Short)
              .setRequired(true)
          )
        );

      return interaction.showModal(modal);
    }

    // ✅ Handler: Edit Sosmed
    else if (selected === "edit") {
      const socials = await socialManager.getUserSocials(userId);

      if (!socials || socials.length === 0) {
        return interaction.reply({
          content: '❌ Kamu belum punya sosial media untuk diedit.',
          ephemeral: true
        });
      }

      const modal = new ModalBuilder()
        .setCustomId("sosmed_modal_edit")
        .setTitle("Edit Sosial Media");

      const components = socials.slice(0, 5).map((social) =>
  new ActionRowBuilder().addComponents(
    new TextInputBuilder()
      .setCustomId(`edit_${social.id}`)
      .setLabel(`Platform: ${social.platform}`)
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(social.username) 
      .setRequired(false)
  )
);

      modal.addComponents(...components);

      return interaction.showModal(modal);
    }

    // 🛠️ Handler: Delete Sosmed (belum tersedia)
    else if (selected === "delete") {
      return interaction.reply({
        content: "❌ Fitur hapus sosial media sedang dalam pengembangan.",
        ephemeral: true
      });
    }

    // ❗Jika value tak dikenal
    else {
      return interaction.reply({
        content: "❌ Pilihan tidak dikenal.",
        ephemeral: true
      });
    }
  }
}).toJSON();
