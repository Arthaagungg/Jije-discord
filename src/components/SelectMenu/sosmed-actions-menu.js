const {
  StringSelectMenuInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
  customId: 'sosmed_action_menu', // support dynamic user ID
  type: "select",

  /**
   * 
   * @param {DiscordBot} client 
   * @param {StringSelectMenuInteraction} interaction 
   */
  run: async (client, interaction) => {
    const [_, action, userId] = interaction.customId.split(":");

    if (interaction.user.id !== userId) {
      return interaction.reply({ content: `❌ Ini bukan menu milik kamu (expected: ${userId} , ${interaction.user.id}).`, ephemeral: true });
    }

    const selected = interaction.values[0];

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
      await interaction.reply({
        content:"test",
        ephemeral:false
    });
    }

    else if (selected === "edit") {
      // Ambil data sosial media user
      const socials = await client.socialHandler.getUserSocials(interaction.user.id);
      if (!socials || socials.length === 0) {
        return interaction.reply({
          content: "❌ Kamu belum punya sosial media yang bisa diedit.",
          ephemeral: true
        });
      }

      const modal = new ModalBuilder()
        .setCustomId("sosmed_modal_edit")
        .setTitle("Edit Sosial Media");

      const components = socials.slice(0, 5).map((social, idx) => (
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId(`edit_${social.platform}_${idx}`)
            .setLabel(`${social.platform} (sekarang: ${social.username})`)
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        )
      ));

      modal.addComponents(...components);

      await interaction.showModal(modal);
    }

    else if (selected === "delete") {
      // Handler delete bisa dibuat pakai modal atau select menu lanjutan
      // Untuk sementara tampilkan alert
      return interaction.reply({
        content: "❌ Fitur hapus sosial media sedang dalam pengembangan.",
        ephemeral: true
      });
    }
  }
}).toJSON();
