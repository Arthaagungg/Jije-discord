const {
  ModalSubmitInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");
const Component = require("../../structure/Component");
const DiscordBot = require("../../client/DiscordBot");

module.exports = new Component({
  customId: 'intro_modal',
  type: 'modal',

  /**
   * @param {DiscordBot} client
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (client, interaction) => {
    const name = interaction.fields.getTextInputValue('intro_name')?.trim();
    const age = interaction.fields.getTextInputValue('intro_age')?.trim();
    const gender = interaction.fields.getTextInputValue('intro_gender')?.trim();
    const region = interaction.fields.getTextInputValue('intro_region')?.trim();
    const about = interaction.fields.getTextInputValue('intro_about')?.trim();

    // Validasi
    if (!name || !age || !gender || !region || !about) {
      return await interaction.reply({
        content: '❌ Semua kolom wajib diisi.',
        ephemeral: true
      });
    }

    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber < 0 || ageNumber > 99) {
      return await interaction.reply({
        content: '❌ Umur harus berupa angka antara 0–99.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setColor(Math.floor(Math.random() * 16777215))
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(
        `\`\`\`ansi\nName    : ${name}\nAge     : ${ageNumber}\nGender  : ${gender}\nRegion  : ${region}\nAbout Me: ${about}\`\`\``
      )
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("intro_button")
        .setLabel("Introduce Yourself")
        .setEmoji("🧾")
        .setStyle(ButtonStyle.Primary)
    );

    const channel = await client.channels.fetch("1377465706815164506");
    await channel.send({
      content: `<@${interaction.user.id}>`,
      embeds: [embed],
      components: [row]
    });

    await interaction.reply({
      content: '✅ Intro kamu berhasil dikirim ke channel!',
      ephemeral: true
    });
  }
}).toJSON();