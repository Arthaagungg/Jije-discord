const Event = require('../../structure/Event');

module.exports = new Event({
  event: 'interactionCreate',
  run: async (client, interaction) => {
    if (interaction.isButton()) {
      if (/^sosmed_manage_\d+$/.test(interaction.customId)) {
        await interaction.reply({
          content: 'Kamu ngeklik tombol sosmed_manage!',
          ephemeral: true,
        });
      }
    }

    if (interaction.isModalSubmit()) {
      if (/^sosmed_modal_\d+$/.test(interaction.customId)) {
        await interaction.reply({
          content: 'Modal diterima!',
          ephemeral: true,
        });
      }
    }

    if (interaction.isStringSelectMenu()) {
      if (/^sosmed_select_\d+$/.test(interaction.customId)) {
        await interaction.reply({
          content: 'Select menu dipilih!',
          ephemeral: true,
        });
      }
    }
  }
}).toJSON();
