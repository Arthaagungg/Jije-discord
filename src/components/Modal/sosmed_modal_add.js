const { ModalSubmitInteraction } = require("discord.js"); const DiscordBot = require("../../client/DiscordBot"); const Component = require("../../structure/Component");

module.exports = new Component({ customId: "sosmed_modal_add", type: "modal",

/**

@param {DiscordBot} client

@param {ModalSubmitInteraction} interaction */ run: async (client, interaction) => { const platform = interaction.fields.getTextInputValue("platform")?.trim().toLowerCase(); const username = interaction.fields.getTextInputValue("username")?.trim();


const allowed = ["tiktok", "instagram", "x"];
if (!allowed.includes(platform)) {
  return interaction.reply({
    content: "❌ Platform tidak valid. Gunakan salah satu dari: tiktok, instagram, x.",
    ephemeral: true
  });
}

await client.socialHandler.addSocial(interaction.user.id, {
  platform,
  username
});

await interaction.reply({
  content: `✅ Berhasil menambahkan ${platform} dengan username \`${username}\`!`,
  ephemeral: true
});

} }).toJSON();

