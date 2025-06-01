const { ModalSubmitInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

const CONFESSION_CHANNEL_ID = '1377404766673702995';

// Fungsi untuk membuat warna HEX random
function getRandomColor() {
  return Math.floor(Math.random() * 16777215); // 0xFFFFFF dalam desimal
}

module.exports = new Component({
  customId: 'confess_write_modal',
  type: 'modal',

  /**
   * @param {DiscordBot} client
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (client, interaction) => {
    const content = interaction.fields.getTextInputValue('confess_content');
    const channel = interaction.guild.channels.cache.get(CONFESSION_CHANNEL_ID);

    if (!channel || channel.type !== ChannelType.GuildText)
      return interaction.reply({ content: 'Channel tidak ditemukan.', ephemeral: true });

    // Disable tombol "Write Confession" sebelumnya
    const messages = await channel.messages.fetch({ limit: 10 });
    for (const msg of messages.values()) {
      if (msg.author.id === client.user.id && msg.components.length > 0) {
        const newRows = msg.components.map(row => {
          const newRow = ActionRowBuilder.from(row);
          newRow.components = newRow.components.map(btn =>
            ButtonBuilder.from(btn).setDisabled(btn.data.custom_id === 'confess_write')
          );
          return newRow;
        });
        await msg.edit({ components: newRows }).catch(() => null);
      }
    }

    // Buat embed baru
    const embed = new EmbedBuilder()
      .setColor(getRandomColor())
      .setTitle('📨 **Anonymous Confession**')
      .setDescription(content)
      .setTimestamp();

    const replyRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`confess_reply`)
        .setLabel(`Reply`)
        .setEmoji('💬')
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId(`confess_write`)
        .setLabel(`Write Confession`)
        .setEmoji('📝')
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({ embeds: [embed], components: [replyRow] });
    await interaction.reply({ content: '✅ Confession kamu berhasil dikirim!', ephemeral: true });
  }
}).toJSON();