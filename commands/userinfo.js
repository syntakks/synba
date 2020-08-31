const Discord = require('discord.js');
const { prefix } = require('../config.json');

module.exports.run = async (bot, message, args) => {
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
      .setTitle('GET User Info')
      .setURL('http://syntaks.io')
      .setDescription('Fetching user data...')
      .addField(
        'Full Username:',
        `${message.author.username}#${message.author.discriminator}`
      )
      .addField('User ID:', message.author.id)
      .addField('Created @:', message.author.createdAt)
      .setImage(message.author.avatarURL())
      .setFooter(`${prefix}userinfo`)
      .setTimestamp();
    message.reply(messageEmbed);
  } catch (error) {
    console.log(error);
  }
};

module.exports.help = {
  name: 'userinfo',
};
