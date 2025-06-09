const { PermissionsBitField, ChannelType } = require("discord.js");
const DiscordBot = require("../DiscordBot");
const config = require("../../config");
const MessageCommand = require("../../structure/MessageCommand");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const { handleMessageCommandOptions, handleApplicationCommandOptions } = require("./CommandOptions");
const { error } = require("../../utils/Console");
const supabase = require("../../utils/supabase");

class CommandsListener {
  /**
   * @param {DiscordBot} client
   */
  constructor(client) {
    // ===== MESSAGE COMMANDS =====
    client.on('messageCreate', async (message) => {
      if (message.author.bot || message.channel.type === ChannelType.DM) return;
      if (!config.commands.message_commands) return;

      let prefix = config.commands.prefix;
      if (client.database.has('prefix-' + message.guild.id)) {
        prefix = client.database.get('prefix-' + message.guild.id);
      }

      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/\s+/g);
      const commandInput = args.shift().toLowerCase();
      if (!commandInput.length) return;

      /** @type {MessageCommand['data']} */
      const command =
        client.collection.message_commands.get(commandInput) ||
        client.collection.message_commands.get(client.collection.message_commands_aliases.get(commandInput));

      if (!command) return;

      try {
        // Opsi tambahan
        if (command.options) {
          const commandContinue = await handleMessageCommandOptions(message, command.options, command.command);
          if (!commandContinue) return;
        }

        // Cek permission
        if (command.command?.permissions && !message.member.permissions.has(PermissionsBitField.resolve(command.command.permissions))) {
          return message.reply({
            content: config.messages.MISSING_PERMISSIONS,
            ephemeral: true
          });
        }

        // ✅ CEK FITUR: Apakah command ini butuh fitur aktif
        if (command.options?.feature) {
          const { data, error } = await supabase
            .from("features")
            .select("enabled")
            .eq("guild_id", message.guild.id)
            .eq("bot_id", client.user.id)
            .eq("feature", command.options.feature)
            .single();

          const isDeveloper = client.developers?.includes(message.author.id);

          if (error || !data || !data.enabled) {
            if (isDeveloper) {
              return message.reply({
                content: `⚠️ Fitur \`${command.options.feature}\` sedang dinonaktifkan di server ini.\nSilakan hubungi <@${config.users.ownerId}> untuk mengaktifkannya.`,
                ephemeral: true
              });
            }

            // Jika bukan developer, jangan kirim balasan
            return;
          }
        }

        // ✅ Semua valid → Jalankan command
        command.run(client, message, args);
      } catch (err) {
        error(err);
      }
    });

    // ===== APPLICATION (SLASH) COMMANDS =====
    client.on('interactionCreate', async (interaction) => {
      if (!interaction.isCommand()) return;

      if (!config.commands.application_commands.chat_input && interaction.isChatInputCommand()) return;
      if (!config.commands.application_commands.user_context && interaction.isUserContextMenuCommand()) return;
      if (!config.commands.application_commands.message_context && interaction.isMessageContextMenuCommand()) return;

      /** @type {ApplicationCommand['data']} */
      const command = client.collection.application_commands.get(interaction.commandName);
      if (!command) return;

      try {
        if (command.options) {
          const commandContinue = await handleApplicationCommandOptions(interaction, command.options, command.command);
          if (!commandContinue) return;
        }

        command.run(client, interaction);
      } catch (err) {
        error(err);
      }
    });
  }
}

module.exports = CommandsListener;
