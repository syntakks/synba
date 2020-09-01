const Discord = require('discord.js');
const https = require('https');

const { prefix } = require('../config.json');

const imageUrls = [
  'https://media1.tenor.com/images/364c43a4d49e3d08d1b499318c948914/tenor.gif?itemid=12222899',
  'https://i.giphy.com/media/wDSPBwB1FoPhC/source.gif',
  'https://i.pinimg.com/originals/67/a1/ec/67a1ecd5a59769d7cbd707706a0f2289.gif',
  'https://media3.giphy.com/media/mIZ9rPeMKefm0/200.gif',
];

module.exports.run = async (bot, db, message, args) => {
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
      .setTitle('WERK')
      .setURL('http://syntaks.io');

    // new-project
    // !werk new-project <projectName>  # Creates new Project
    // !werk new-project <projectName> start  # Creates new Project and new Session right now.
    if (args[0] === 'new-project') {
      if (!args[1])
        return message.reply(
          'Please specify a PROJECT NAME! -> !werk new-project <ProjectName>'
        );
      return await newProject(db, messageEmbed, message, args);
    }

    //new-session
    // !werk new-session <projectID>  # Creates new session for project.
    if (args[0] === 'new-session') {
      if (!args[1]) return message.reply('Please specify a ProjectID!');
      newSession(messageEmbed, message, args);
    }

    // show-project
    // !werk show-project <projectID>   # Shows Project Data.
    if (args[0] === 'show-project') {
    }

    // show-session
    // !werk show-session <sessionID, current>   # Shows Session Data.
    if (args[0] === 'show-session') {
    }

    // get-project
    // !werk get-project <projectID> adduser <@mention or all>  # Adds specific user to project or specific roled users to project, or just all users in guild.
    if (args[0] === 'get-project') {
    }

    if (args[0] === 'delete-project') {
      if (args[1]) {
        await deleteProject(db, messageEmbed, message, args);
      } else {
        message.reply('You must specify a project to delete!');
      }
    }

    // list
    // !werk list projects  # Shows list of all projects for that user.
    // !werk list projects like <ProjectNameQuery>   # List all projects like the query.
    // !werk list sessions  # Shows list of all sessions for that user.
    // !werk list sessions project <projectID>    # Shows list of sessions for a given project.
    if (args[0] === 'list') {
      if (args[1] === 'projects') {
        return await listProjects(db, messageEmbed, message, args);
      }
    }
  } catch (error) {
    message.reply(error.stack);
    console.log(error);
  }
};

// !werk new-project <projectName>  # Creates new Project
// !werk new-project <projectName> start  # Creates new Project and new Session right now.
async function newProject(db, messageEmbed, message, args) {
  try {
    // Create Project in Database
    db.query('INSERT INTO projects SET ?', { name: args[1] }, function (
      error,
      results,
      fields
    ) {
      if (error) {
        message.reply(error.sqlMessage);
      } else {
        id = results.insertId;
        messageEmbed.addField('Project Name:', `${args[1]}`, true);
        messageEmbed.addField('Project ID:', id, true);

        // If start arg, create session on this project
        let createSession = args[2] === 'start';
        if (createSession) {
          // Create Session in server, then add Session data here
          messageEmbed.setDescription('CREATE New Project && START Session...');
          messageEmbed.addField('Session ID:', '123412341234', true);
        } else {
          messageEmbed.setDescription('CREATE New Project...');
        }
        messageEmbed.addField(
          'Created by:',
          `${message.author.username}#${message.author.discriminator}`,
          true
        );
        messageEmbed.setImage(
          'https://media3.giphy.com/media/mIZ9rPeMKefm0/200.gif'
        );
        messageEmbed.setFooter(`${prefix}werk Created New Project`);
        messageEmbed.setTimestamp();
        // Send the reply
        message.reply(messageEmbed);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function deleteProject(db, messageEmbed, message, args) {
  try {
    // Delete the project row
    await db.query('DELETE FROM `projects` WHERE `id` = ?', args[1], function (
      error,
      results,
      fields
    ) {
      if (error) {
        message.reply(error.sqlMessage);
      } else {
        messageEmbed.addField('Project ID:', args[1]);
        messageEmbed.setDescription(`DELETE Project...`);
        messageEmbed.addField('Deleted Row(s):', results.affectedRows);
        messageEmbed.addField(
          'Deleted by:',
          `${message.author.username}#${message.author.discriminator}`,
          true
        );
        messageEmbed.setImage(
          'https://media.tenor.com/images/60150adbdc2e9e4110b1f30e4cc5f289/tenor.gif'
        );
        messageEmbed.setFooter(`${prefix}werk DELETE Project`);
        messageEmbed.setTimestamp();
        // Send the reply
        message.reply(messageEmbed);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function listProjects(db, messageEmbed, message, args) {
  try {
    // Create Project in Database
    db.query('SELECT * FROM `projects`', function (error, results, fields) {
      if (error) {
        message.reply(error.sqlMessage);
      } else {
        console.log('results', results);
        results.forEach((project) => {
          messageEmbed.addFields(
            { name: 'Project Name:', value: project.name, inline: true },
            { name: 'Project ID:', value: project.id, inline: true },
            { name: 'Creation:', value: project.created, inline: true }
          );
        });
        messageEmbed.setDescription('GET ALL Projects...');
        messageEmbed.addField(
          'Requested by:',
          `${message.author.username}#${message.author.discriminator}`,
          true
        );
        messageEmbed.setImage(
          'https://i.pinimg.com/originals/67/a1/ec/67a1ecd5a59769d7cbd707706a0f2289.gif'
        );
        messageEmbed.setFooter(`${prefix}werk GET ALL Projects`);
        messageEmbed.setTimestamp();
        // Send the reply
        message.reply(messageEmbed);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function newSession(messageEmbed, message, args) {
  messageEmbed.setDescription('CREATE New Project...');
  messageEmbed.addField(
    'Full Username:',
    `${message.author.username}#${message.author.discriminator}`
  );
  messageEmbed.addField('User ID:', message.author.id);
  messageEmbed.addField('Created @:', message.author.createdAt);
  messageEmbed.setImage(
    'https://quickchart.io/chart?bkg=white&c={type:%27bar%27,data:{labels:[2012,2013,2014,2015,2016],datasets:[{label:%27Users%27,data:[120,60,50,180,120]}]}}'
  );
  messageEmbed.setFooter(`${prefix}werk`);
  messageEmbed.setTimestamp();
}

// Use this later.
// var chartURL = 'https://quickchart.io/chart?bkg=white&c=';
// let donughtData = await getDonutChartParams(['Projects'], [0], 0);
// chartURL += donughtData;
// console.log('chartURL', chartURL);
async function getDonutChartParams(labels, data, total) {
  try {
    const urlEncodedJson = await JSON.stringify({
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
          },
        ],
      },
      options: {
        plugins: {
          doughnutlabel: {
            labels: [
              {
                text: total,
                font: {
                  size: 20,
                },
              },
              {
                text: 'Total',
              },
            ],
          },
        },
      },
    });
    console.log(urlEncodedJson);
    // return encodeURI(urlEncodedJson);
    return urlEncodedJson;
  } catch (error) {
    console.error(error);
  }
}

module.exports.help = {
  name: 'werk',
};
