const { ModalSubmitInteraction } = require("discord.js");
const fs = require("fs");
const path = require("path");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");

const filePath = path.join(__dirname, "../../data/sosmed.json");

function load() {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}
function save(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

module.exports = new Component({
    customId: 'sosmed_add',
    type: 'modal',

    /**
     * @param {DiscordBot} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    run: async (client, interaction) => {
        const platform = interaction.fields.getTextInputValue("platform");
        const username = interaction.fields.getTextInputValue("username");

        const sosmed = load();
        if (!sosmed[interaction.user.id]) sosmed[interaction.user.id] = {};
        sosmed[interaction.user.id][platform] = username;
        save(sosmed);

        await interaction.reply({
            content: `✅ Berhasil menambahkan **${platform}**: ${username}`,
            ephemeral: true
        });
    }
}).toJSON();
