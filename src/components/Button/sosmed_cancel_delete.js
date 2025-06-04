const Component = require("../../structure/Component");
const DiscordBot = require("../../client/DiscordBot");

module.exports = new Component({
  customId: "sosmed_cancel_delete",
  type: "button",

  run: async (client, interaction) => {
    return interaction.update({
      content: "❌ Penghapusan dibatalkan.",
      components: []
    });
  }
}).toJSON();
