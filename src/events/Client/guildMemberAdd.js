const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Event = require('../../structure/Event');

module.exports = new Event({
  event: 'guildMemberAdd',
  run: async (client, member) => {
    const channel = member.guild.channels.cache.get('1354589321511960754');
    if (!channel) return;

    const guild = member.guild;

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('WELCOME TO TEMAN-TEMAN JIJE')
      .setDescription(`**Selamat datang di Teman-Teman Jije, ${member.user.username}! 💠**\n\n*Tempat di mana pertemanan tumbuh, tawa bergaung, dan kenangan tercipta. Bergabunglah dan jadilah bagian dari cerita kami.*`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setImage('https://cdn.discordapp.com/attachments/1366956080139337768/1377550408725172244/Blue_Cartoon_Playful_Animated_Welcome_Youtube_Intro_Video.gif?ex=68395f4b&is=68380dcb&hm=5aac1bc989308a1a9669c13fbf059a6d3f2888cdbf3974e0ddc3fcdbe07a91c5')
      .setFooter({ text: 'HAVE FUN WITH TEMAN-TEMAN JIJE!' });

    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('📋 Introduction')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.com/channels/1354589321511960747/1377465706815164506'),

      new ButtonBuilder()
        .setLabel('🖐️ Self Roles')
        .setStyle(ButtonStyle.Link)
        .setURL('https://discord.com/channels/1354589321511960747/1375854701949489203')
    );

    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('🔎 Follow Us!')
        .setStyle(ButtonStyle.Link)
        .setURL('https://msha.ke/zizeabsenn')
    );

    await channel.send({
      content: `What's up, ${member}!`,
      embeds: [embed],
      components: [row1, row2],
    });
  }
}).toJSON();