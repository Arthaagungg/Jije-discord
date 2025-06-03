module.exports = {
  name: 'interactionCreate',

  async execute(interaction) {
    const { customId } = interaction;

    // Tombol
    if (interaction.isButton()) {
      const match = customId.match(/^sosmed_manage_(\d{17,20})$/);
      if (match) {
        const userId = match[1];
        return interaction.reply({ content: `Tombol untuk user ${userId}`, ephemeral: true });
      }
    }

    // Select menu
    if (interaction.isStringSelectMenu()) {
      const match = customId.match(/^sosmed_manage_(\d{17,20})$/);
      if (match) {
        const userId = match[1];
        return interaction.reply({ content: `Select menu untuk user ${userId}`, ephemeral: true });
      }
    }

    // Modal
    if (interaction.isModalSubmit()) {
      const match = customId.match(/^sosmed_manage_(\d{17,20})$/);
      if (match) {
        const userId = match[1];
        return interaction.reply({ content: `Modal untuk user ${userId}`, ephemeral: true });
      }
    }
  }
};
