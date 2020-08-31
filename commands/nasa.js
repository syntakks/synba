const Discord = require('discord.js');
const https = require('https');
const { prefix, nasa_key } = require('../config.json');

module.exports.run = async (bot, message, args) => {
  https
    .get(
      `https://api.nasa.gov/planetary/apod?api_key=${nasa_key}`,
      (resonse) => {
        let data = '';

        // A chunk of data has been recieved.
        resonse.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resonse.on('end', () => {
          try {
            const json = JSON.parse(data);
            console.log(json);
            if (json.code === 404) {
              message.reply('No image data available today...');
              return;
            }
            var explanation = '';
            if (json.explanation.length > 500) {
              explanation =
                json.explanation.substring(0, 500) +
                '...See full description: https://apod.nasa.gov/apod/astropix.html';
            } else {
              explanation =
                json.explanation +
                '...See full description: https://apod.nasa.gov/apod/astropix.html';
            }

            let description =
              json.media_type === 'video'
                ? 'Video: Click title to watch!'
                : 'Nasa Pic of the Day';

            const messageEmbed = new Discord.MessageEmbed()
              .attachFiles(['./assets/robot.png'])
              .setThumbnail('attachment://robot.png')
              .setColor('#F7931E')
              .setURL('https://apod.nasa.gov/apod/astropix.html')
              .setAuthor(
                'syntaks.io',
                'http://syntaks.io/img/blueLogo.png',
                'http://syntaks.io'
              )
              .setTitle(json.title)
              .setDescription(description)
              .addField('Description', explanation)
              .setImage(json.hdurl)
              .setFooter(`${prefix}nasa`)
              .setTimestamp();
            message.reply(messageEmbed);
          } catch (error) {
            console.log(error);
          }
        });
      }
    )
    .on('error', (error) => {
      console.log('Error: ' + error.message);
    });
};

module.exports.help = {
  name: 'nasa',
};
