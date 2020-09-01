const Discord = require('discord.js');
const https = require('https');
const { prefix } = require('../config.json');

module.exports.run = async (bot, db, message, args) => {
  https
    .get('https://api.chucknorris.io/jokes/random', (response) => {
      let data = '';

      // A chunk of data has been recieved.
      response.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      response.on('end', () => {
        const json = JSON.parse(data);
        console.log('chuck-norris', json.value);
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
            .setTitle('Chuck F&$*ing Norris!')
            .setURL('https://www.youtube.com/watch?v=zj2Zf9tlg2Y')
            .setDescription('Fetching joke data...')
            .addField('Facts:', json.value)
            .setFooter(`${prefix}chuck-norris`)
            .setTimestamp();
          message.reply(messageEmbed);
        } catch (error) {
          console.log(error);
        }
      });
    })
    .on('error', (error) => {
      console.log('Error: ' + error.message);
    });
};

module.exports.help = {
  name: 'chuck',
};
