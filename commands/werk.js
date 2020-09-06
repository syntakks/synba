const Discord = require('discord.js');
const user = require('../werk/user');
const project = require('../werk/project');
const session = require('../werk/session');

module.exports.run = async (bot, db, message, args) => {
  try {
    let messageEmbed = new Discord.MessageEmbed()
      .attachFiles(['./assets/robot.png'])
      .setThumbnail('attachment://robot.png')
      .setColor('#F7931E')
      .setAuthor(
        'syntaks.io',
        'http://syntaks.io/img/blueLogo.png',
        'http://syntaks.io'
      )
      .setTitle('WERK')
      .setURL('http://syntaks.io');

    if (args[0] === 'user') {
      if (message.channel.type === 'dm') {
        return message.reply("You can't use this feature in a DM!");
      }
      return await user.handle(db, messageEmbed, message, args);
    }
    if (args[0] === 'project') {
      return await project.handle(db, messageEmbed, message, args);
    }
    if (args[0] === 'session') {
      return await session.handle(db, messageEmbed, message, args);
    }
  } catch (error) {
    message.reply(error.stack);
    console.log(error);
  }
};

module.exports.help = {
  name: 'werk',
};
