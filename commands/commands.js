const Discord = require('discord.js');
const fs = require('fs');
const { prefix } = require('../config.json');

module.exports.run = async (bot, message, args) => {
  try {
    fs.readdir('./commands', (err, files) => {
      if (err) return console.error(err);

      let commands = files.map((file, index) => {
        return `${prefix}${file.split('.')[0]}`;
      });
      console.log('commands', commands);
      if (commands.length < 1) return console.error('No bot commands!');

      const messageEmbed = new Discord.MessageEmbed()
        .attachFiles(['./assets/robot.png'])
        .setThumbnail('attachment://robot.png')
        .setColor('#F7931E')
        .setAuthor(
          'syntaks.io',
          'http://syntaks.io/img/blueLogo.png',
          'http://syntaks.io'
        )
        .setTitle('GET Commands')
        .setURL('http://syntaks.io')
        .setDescription('Listing bot commands...')
        .addField('Commands:', commands)
        .setFooter(`${prefix}commands`)
        .setTimestamp();
      message.reply(messageEmbed);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.help = {
  name: 'commands',
};
