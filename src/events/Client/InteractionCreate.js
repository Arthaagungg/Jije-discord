const Event = require('../../../structure/Event');

module.exports = new Event({
  event: 'interactionCreate',
  run: async (client, interaction) => {
    try {
      // Handle Select Menu dengan customId sosmed_action_menu_{userId}
      if (interaction.isStringSelectMenu()) {
        const customId = interaction.customId;

        // Cek apakah customId cocok dengan pola sosmed_action_menu_123456
        const match = /^sosmed_action_menu_(\d+)$/.exec(customId);
        if (match) {
          const userId = match[1];

          // Optional: cek apakah interaction.user.id === userId untuk validasi
          if (interaction.user.id !== userId) {
            return interaction.reply({
              content: '❌ Ini bukan menu untukmu!',
              ephemeral: true,
            });
          }

          const selected = interaction.values; // array of selected values
          
          // Lakukan aksi sesuai value yang dipilih
          return interaction.reply({
            content: `✅ Kamu memilih: ${selected.join(', ')}`,
            ephemeral: true,
          });
        }
      }

      // Tambahkan handler lain jika perlu (misalnya button/modal/command dsb)
    } catch (err) {
      console.error('❌ Error di interactionCreate:', err);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Terjadi kesalahan.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Terjadi kesalahan.', ephemeral: true });
      }
    }
  }
}).toJSON();
