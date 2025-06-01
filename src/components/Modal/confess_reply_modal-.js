const {
  ModalSubmitInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  MessageFlags
} = require("discord.js");

const Component = require("../../structure/Component");
const DiscordBot = require("../../client/DiscordBot");

// Fungsi untuk membuat warna HEX random
function getRandomColor() {
  return Math.floor(Math.random() * 16777215); // 0xFFFFFF dalam desimal
}

module.exports = new Component({
  customId: /^confess_reply_modal-/,
  type: 'modal',

  /**
   * @param {DiscordBot} client
   * @param {ModalSubmitInteraction} interaction
   */
  run: async (client, interaction) => {
    try {
      const content = interaction.fields.getTextInputValue('reply_content');
      const messageId = interaction.customId.split('-')[1];
      const currentChannel = interaction.channel;

      if (!messageId || !currentChannel) {
        return interaction.reply({
          content: '❌ Terjadi kesalahan: data tidak lengkap.',
          flags: MessageFlags.Ephemeral,
        });
      }

      let targetThread = null;

      // Jika sedang di dalam thread, langsung kirim ke thread itu
      if (currentChannel.isThread()) {
        targetThread = currentChannel;
      } else {
        // Ambil message yang ditekan tombolnya
        const confessionMsg = await currentChannel.messages.fetch(messageId).catch(() => null);
        if (!confessionMsg) {
          return interaction.reply({
            content: '❌ Confession tidak ditemukan atau sudah dihapus.',
            flags: MessageFlags.Ephemeral,
          });
        }

        // Cek atau buat thread baru dari confession message
        targetThread = confessionMsg.hasThread ? confessionMsg.thread : null;
        if (!targetThread) {
          targetThread = await confessionMsg.startThread({
            name: `Reply to Confession`,
            autoArchiveDuration: 60,
            reason: 'Confession reply thread',
          }).catch(() => null);
        }

        if (!targetThread) {
          return interaction.reply({
            content: '❌ Gagal membuat thread.',
            flags: MessageFlags.Ephemeral,
          });
        }
      }

      // Kirim embed anonymous reply ke thread
      const replyEmbed = new EmbedBuilder()
        .setColor(getRandomColor())
        .setTitle(`🗨️ **Anonymous Reply:**`)
        .setDescription(content)
        .setTimestamp();

      const replyButton = new ButtonBuilder()
        .setCustomId('confess_reply')
        .setLabel(`Reply`)
        .setEmoji(`💬`)
        .setStyle(ButtonStyle.Secondary);

      const row = new ActionRowBuilder().addComponents(replyButton);

      await targetThread.send({
        embeds: [replyEmbed],
        components: [row]
      });

      await interaction.reply({
        content: '✅ Balasan kamu telah dikirim!',
        flags: MessageFlags.Ephemeral,
      });

    } catch (err) {
      console.error('[confess_reply_modal] Error:', err);
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ Terjadi kesalahan saat memproses balasan kamu.',
          flags: MessageFlags.Ephemeral,
        }).catch(console.error);
      }
    }
  }
}).toJSON();