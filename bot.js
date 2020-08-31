const https = require('https'); 
const { token, prefix, nasa_key } = require("./config.json"); 
const Discord = require('discord.js');
const client = new Discord.Client();

const commands = ['!commands', '!server', '!userinfo', '!chuck-norris', '!nasa']; 

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    let link = await client.generateInvite(["ADMINISTRATOR"]);
    console.log(link);
});

client.on('message', async message => {
    if (message.author.bot) return;
    let messageArray = message.content.split(' ');
    let command = messageArray[0];
    let args = messageArray.slice(1);
    console.log('messageArray', messageArray);
    console.log('command', command);
    console.log('args', args);
    if (!command.startsWith(prefix)) return;

    if (command === `${prefix}commands`) {
        getCommands(message); 
        return;
    }
    if (command === `${prefix}food`) {
        message.reply('GO EAT TACOS'); 
        return;
    }
    if (command === `${prefix}server`) {
        server(message); 
        return;
    }
    if (command === `${prefix}userinfo`) {
        userInfo(message); 
        return;
    }
    if (command === `${prefix}chuck-norris`) {
        getChuckJoke(message); 
        return;
    }
    if (command === `${prefix}nasa`) {
        getNasaPicOfDay(message); 
        return;
    }
});

client.on('messageDelete', async message => {
    console.log('Message Deleted', message); 
});

async function getCommands(message) {
    try {
        const messageEmbed = new Discord.MessageEmbed()
            .attachFiles(['./assets/robot.png'])
            .setThumbnail('attachment://robot.png')
            .setColor('#F7931E')
            .setAuthor('syntaks.io', 'http://syntaks.io/img/blueLogo.png', 'http://syntaks.io')
            .setTitle('GET Commands')
            .setURL('http://syntaks.io')
            .setDescription('Listing bot commands...')
            .addField('Commands:', commands)
            .setFooter(`${prefix}commands`)
            .setTimestamp();
        message.reply(messageEmbed);
    }
    catch(error) {
        console.log(error); 
    }
}

async function server(message) {
    console.log('server');
    if (message.channel.type === 'dm') return;
    try {
        const messageEmbed = new Discord.MessageEmbed()
            .attachFiles(['./assets/robot.png'])
            .setThumbnail('attachment://robot.png')
            .setColor('#F7931E')
            .setAuthor('syntaks.io', 'http://syntaks.io/img/blueLogo.png', 'http://syntaks.io')
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
    }
    catch(error) {
        console.log(error); 
    }
}

async function userInfo(message) {
    try {
        const messageEmbed = new Discord.MessageEmbed()
            .attachFiles(['./assets/robot.png'])
            .setThumbnail('attachment://robot.png')
            .setColor('#F7931E')
            .setAuthor('syntaks.io', 'http://syntaks.io/img/blueLogo.png', 'http://syntaks.io')
            .setTitle('User Info')
            .setURL('http://syntaks.io')
            .setDescription('Fetching user data...')
            .addField('Full Username:', `${message.author.username}#${message.author.discriminator}`)
            .addField('User ID:', message.author.id)
            .addField('Created @:', message.author.createdAt)
            .setImage(message.author.avatarURL())
            .setFooter(`${prefix}userinfo`)
            .setTimestamp();
        message.reply(messageEmbed);
    }
    catch(error) {
        console.log(error); 
    }
}

async function getChuckJoke(message) {
    https.get('https://api.chucknorris.io/jokes/random', (response) => {
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
                    .setAuthor('syntaks.io', 'http://syntaks.io/img/blueLogo.png', 'http://syntaks.io')
                    .setTitle('Chuck F&$*ing Norris!')
                    .setURL('https://www.youtube.com/watch?v=zj2Zf9tlg2Y')
                    .setDescription('Fetching joke data...')
                    .addField('Facts:', json.value)
                    .setFooter(`${prefix}chuck-norris`)
                    .setTimestamp();
                message.reply(messageEmbed);
            }
            catch(error) {
                console.log(error); 
            }
        });
    })
    .on("error", (error) => {
    console.log("Error: " + error.message);
    });
}

async function getNasaPicOfDay(message) {
    https.get(`https://api.nasa.gov/planetary/apod?api_key=${nasa_key}`, (resonse) => {
    let data = '';

        // A chunk of data has been recieved.
        resonse.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resonse.on('end', () => {
            try {
                const json = JSON.parse(data); 
                if (json.code === 404) {
                    message.reply('No image data available today...');
                    return;
                }
                var explanation = ""; 
                if (json.explanation.length > 500) {
                    explanation = json.explanation.substring(0, 500) + 
                    '...See full description: https://apod.nasa.gov/apod/astropix.html'; 
                } else {
                    explanation = json.explanation +
                    '...See full description: https://apod.nasa.gov/apod/astropix.html';
                }
                
                const exampleEmbed = new Discord.MessageEmbed()
                    .attachFiles(['./assets/robot.png'])
                    .setColor('#F7931E')
                    .setTitle(json.title)
                    .setURL('https://discord.js.org/')
                    .setAuthor('synba')
                    .setDescription('Nasa Pic of the Day')
                    .setThumbnail('attachment://robot.png')
                    .addField('Description', explanation)
                    .setImage(json.hdurl)
                    .setFooter(`${prefix}nasa`)
                    .setTimestamp();
                message.reply(exampleEmbed);
            }
            catch(error) {
                console.log(error); 
            }
        });
    })
    .on("error", (error) => {
    console.log("Error: " + error.message);
    });
}

// Login
try {
    client.login(token);
}
catch (error) {
    console.log(error); 
}
