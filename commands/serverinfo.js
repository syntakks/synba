const Discord = require('discord.js');
const { prefix } = require('../config.json');

module.exports.run = async (bot, db, message, args) => {
  if (message.channel.type === 'dm')
    return message.reply('This is a dm message...');
  try {
    const messageEmbed = new Discord.MessageEmbed()
      .attachFiles(['./assets/robot.png'])
      .setThumbnail('attachment://robot.png')
      .setColor('#F7931E')
      .setAuthor(
        'syntaks.io',
        'http://syntaks.io/img/blueLogo.png',
        'http://syntaks.io'
      )
      .setTitle('GET Server Info')
      .setURL('http://syntaks.io')
      .setDescription('Fetching server data...')
      .addField('Server Name:', message.guild.name)
      .addField('Server Owner:', message.guild.owner)
      .addField('Total Members:', message.guild.memberCount)
      .setImage(message.guild.owner.user.avatarURL())
      .setFooter(`${prefix}server`)
      .setTimestamp();
    message.reply(messageEmbed);
  } catch (error) {
    console.log(error);
  }
};

module.exports.help = {
  name: 'serverinfo',
};
