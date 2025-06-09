const { PermissionsBitField, ChannelType } = require("discord.js");
const config = require("../../config");
const MessageCommand = require("../../structure/MessageCommand");
const { handleMessageCommandOptions } = require("./CommandOptions");
const { error } = require("../../utils/Console");
const supabase = require("../../utils/supabase");

/**
 * @param {import("../DiscordBot")} client
 */
class CommandsListener {
  constructor(client) {
    client.on("messageCreate", async (message) => {
      if (message.author.bot || message.channel.type === ChannelType.DM) return;
      if (!config.commands.message_commands) return;

      let prefix = config.commands.prefix;
      const guildId = message.guild?.id;
      const userId = message.author.id;
      const botId = client.user.id;

      // Ambil prefix custom dari local database
      if (client.database.has("prefix-" + guildId)) {
        prefix = client.database.get("prefix-" + guildId);
      }

      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/\s+/g);
      const commandInput = args.shift()?.toLowerCase();
      if (!commandInput?.length) return;

      /**
       * @type {MessageCommand['data']}
       */
      const command =
        client.collection.message_commands.get(commandInput) ||
        client.collection.message_commands.get(client.collection.message_commands_aliases.get(commandInput));

      if (!command) return;

      try {
        // 🔒 Handle opsi & validasi command
        if (command.options) {
          const commandContinue = await handleMessageCommandOptions(message, command.options, command.command);
          if (!commandContinue) return;
        }

        // 🔐 Permission Discord
        if (
          command.command?.permissions &&
          !message.member.permissions.has(PermissionsBitField.resolve(command.command.permissions))
        ) {
          await message.reply({
            content: config.messages.MISSING_PERMISSIONS,
            ephemeral: true,
          });
          return;
        }

        // ⚙️ Cek fitur command jika menggunakan fitur
        if (command.options?.feature) {
          const featureName = command.options.feature;

          const { data: featureData, error: featureError } = await supabase
            .from("features")
            .select("enabled")
            .eq("guild_id", guildId)
            .eq("bot_id", botId)
            .eq("feature", featureName)
            .single();

          const fiturDinonaktifkan = featureError || !featureData || !featureData.enabled;

          if (fiturDinonaktifkan) {
            // 👨‍💻 Cek apakah user adalah developer dari Supabase
            const { data: developerData, error: developerError } = await supabase
              .from("developers")
              .select("user_id")
              .eq("guild_id", guildId)
              .eq("bot_id", botId)
              .eq("user_id", userId)
              .maybeSingle();

            const isDeveloper = developerData && !developerError;

            if (isDeveloper) {
              return message.reply({
                content: `⚠️ Fitur \`${featureName}\` sedang dinonaktifkan di server ini.\nSilahkan hubungi <@${config.users.ownerId}> untuk mengaktifkannya.`,
                ephemeral: true,
              });
            }

            // ❌ Bukan developer — tidak beri balasan apa pun
            return;
          }
        }

        // ✅ Jalankan command
        command.run(client, message, args);
      } catch (err) {
        error(err);
      }
    });
client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;

            if (!config.commands.application_commands.chat_input && interaction.isChatInputCommand()) return;
            if (!config.commands.application_commands.user_context && interaction.isUserContextMenuCommand()) return;
            if (!config.commands.application_commands.message_context && interaction.isMessageContextMenuCommand()) return;

            /**
             * @type {ApplicationCommand['data']}
             */
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
