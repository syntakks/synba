const https = require('https'); 
const { token, prefix, nasa_key } = require("./config.json"); 
const Discord = require('discord.js');
const client = new Discord.Client();

const commands = ['!commands', '!ping', '!server', '!userinfo', '!chuck-norris', '!nasa']; 

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
    if (command === `${prefix}ping`) {
        ping(message); 
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

async function getCommands(msg) {
    try {
        const exampleEmbed = new Discord.MessageEmbed()
            .attachFiles(['./assets/robot.png'])
            .setColor('#0099ff')
            .setTitle('How can I help you?')
            .setURL('https://discord.js.org/')
            .setAuthor('synba', 'attachment://robot.svg')
            .setDescription('Your Server Assistant')
            .setThumbnail('attachment://robot.png')
            .addField('Commands', commands)
            .setImage('attachment://robot.svg')
            .setTimestamp()
            .setFooter(`${prefix}commands`);
        msg.reply(exampleEmbed);
    }
    catch(err) {
        console.log(err); 
    }
}

async function ping(msg) {
    try {
        const exampleEmbed = new Discord.MessageEmbed()
            .attachFiles(['./assets/robot.png'])
            .setColor('#0099ff')
            .setTitle('How can I help you?')
            .setURL('https://discord.js.org/')
            .setAuthor('synba', 'attachment://robot.svg')
            .setDescription('Your Server Assistant')
            .setThumbnail('attachment://robot.png')
            .addField('Response', 'pong')
            .setImage('attachment://robot.svg')
            .setTimestamp()
            .setFooter(`${prefix}ping`);
        msg.reply(exampleEmbed);
    }
    catch(err) {
        console.log(err); 
    }
}

async function server(msg) {
    try {
        const exampleEmbed = new Discord.MessageEmbed()
            .attachFiles(['./assets/robot.png'])
            .setColor('#0099ff')
            .setTitle('How can I help you?')
            .setURL('https://discord.js.org/')
            .setAuthor('synba')
            .setDescription('Your Server Assistant')
            .setThumbnail('attachment://robot.png')
            .addField('Server Name', msg.guild.name)
            .addField('Server Owner', msg.guild.owner)
            .addField('Total Members', msg.guild.memberCount)
            .setImage(msg.guild.owner.avatarURL)
            .setTimestamp()
            .setFooter(`${prefix}server`);
        msg.reply(exampleEmbed);
    }
    catch(err) {
        console.log(err); 
    }
}

async function userInfo(msg) {
    try {
        const exampleEmbed = new Discord.MessageEmbed()
            .attachFiles(['./assets/robot.png'])
            .setColor('#0099ff')
            .setTitle('How can I help you?')
            .setURL('https://discord.js.org/')
            .setAuthor('synba')
            .setDescription('Your Server Assistant')
            .setThumbnail('attachment://robot.png')
            .addField('Your Username', msg.author.username)
            .addField('User ID', msg.author.id)
            .setImage(msg.author.avatarURL)
            .setTimestamp()
            .setFooter(`${prefix}user-info`);
        msg.reply(exampleEmbed);
    }
    catch(err) {
        console.log(err); 
    }
}

async function getChuckJoke(msg) {
    https.get('https://api.chucknorris.io/jokes/random', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        const json = JSON.parse(data); 
        console.log('chuck-norris', json.value); 
        try {
            const exampleEmbed = new Discord.MessageEmbed()
                .attachFiles(['./assets/robot.png'])
                .setColor('#0099ff')
                .setTitle('Fucking Chuck Norris!')
                .setURL('https://discord.js.org/')
                .setAuthor('synba')
                .setDescription('Your Server Assistant')
                .setThumbnail('attachment://robot.png')
                .addField('Chuck Norris Joke', json.value)
                .setTimestamp()
                .setFooter(`${prefix}chuck-norris`);
            msg.reply(exampleEmbed);
        }
        catch(err) {
            console.log(err); 
        }
    });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });
}

async function getNasaPicOfDay(msg) {
    https.get(`https://api.nasa.gov/planetary/apod?api_key=${nasa_key}`, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        try {
            const json = JSON.parse(data); 
            var explanation = ""; 
            if (json.explanation.length > 500) {
                explanation = json.explanation.substring(0, 500) + 
                '...See full description: https://apod.nasa.gov/apod/astropix.html'; 
            } else {
                explanation = json.explanation +
                '...See full description: https://apod.nasa.gov/apod/astropix.html';
            }
            console.log('nasa-pic-of-day', json);
            const exampleEmbed = new Discord.MessageEmbed()
                .attachFiles(['./assets/robot.png'])
                .setColor('#0099ff')
                .setTitle(json.title)
                .setURL('https://discord.js.org/')
                .setAuthor('synba')
                .setDescription('Nasa Pic of the Day')
                .setThumbnail('attachment://robot.png')
                .addField('Description', explanation)
                .setTimestamp()
                .setImage(json.hdurl)
                .setFooter(`${prefix}nasa`);
            msg.reply(exampleEmbed);
        }
        catch(err) {
            console.log(err); 
        }
    });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });
}

// Login
try {
    client.login(token);
}
catch (err) {
    console.log(err); 
}
