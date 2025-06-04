const {
  ButtonInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType
} = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

module.exports = new Component({
  // Kita pakai wildcard handler
  customId: /^sosmed_manage_\d+$/,
  type: "button",

  /**
   * @param {DiscordBot} client 
   * @param {ButtonInteraction} interaction 
   */
  run: async (client, interaction) => {
    
    await interaction.deferUpdate();

    const userId = interaction.user.id;
    const targetId = interaction.customId.replace("sosmed_manage_", "");
    
    if (userId !== targetId) {
      return interaction.editReply({
        content: "❌ Ini bukan menu milik kamu.",
        ephemeral: true
      });
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`sosmed_action_menu_${interaction.user.id}`)
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

    const row1 = new ActionRowBuilder().addComponents(selectMenu);

    const disabledButton = new ButtonBuilder()
      .setCustomId(`sosmed_manage_${userId}`)
      .setLabel("Kelola Sosial Media")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    const row2 = new ActionRowBuilder().addComponents(disabledButton);

    const reply = await interaction.editReply({
      content: "Pilih aksi yang ingin kamu lakukan:",
      components: [row1, row2],
    });

    // 💡 Collector: biarkan handler modal/select lain yang proses pilihan
    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 2 * 60 * 1000, // 2 menit
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== userId) {
        return i.reply({
          content: "❌ Ini bukan menu milik kamu.",
          ephemeral: true,
        });
      }

      // Handler khusus akan menangani interaction ini
    });

    collector.on("end", async () => {
      selectMenu.setDisabled(true);
      await reply.edit({
        components: [
          new ActionRowBuilder().addComponents(selectMenu),
          row2
        ]
      });
    });
  }
}).toJSON();
