const https = require('https'); 
const { token, prefix, nasa_key } = require("./config.json"); 
const pokedex = require('./assets/pokedex.json'); 
const Discord = require('discord.js');
const client = new Discord.Client();

const commands = ['!commands', '!ping', '!server', '!user-info', '!trump', '!chuck-norris', '!nasa', '!pdex']; 

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {

    // Pokecord
    if (msg.author.id == 365975655608745985) {
        const emb = msg.embeds[0]; 
        if (emb) { 
            if (emb.title.includes('wild')) {
                console.log(`Pokecord Title: ${emb.title}`);
                const imgUrl = emb.image.url; 
                console.log(`Image URL: ${imgUrl}`);
                msg.reply(`Image URL: ${emb.image.url}`); 
            }
        }
        return; 
    }

    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(' ');
    console.log('args', args);  

    if (args[0] === 'pdex') {
        if (!args[1]) {
            msg.reply('You must provide a hint to search.')
        }
        else {
            getPokemonFromHint(msg, args[1]); 
        }
        return;
    }

    if (msg.content === `${prefix}commands`) {
        getCommands(msg); 
        return;
    }
    if (msg.content === `${prefix}food`) {
        msg.reply('GO EAT TACOS'); 
        return;
    }
    if (msg.content === `${prefix}ping`) {
        ping(msg); 
        return;
    }
    if (msg.content === `${prefix}server`) {
        server(msg); 
        return;
    }
    if (msg.content === `${prefix}user-info`) {
        userInfo(msg); 
        return;
    }
    if (msg.content === `${prefix}trump`) {
        getRandomTrumpQuote(msg); 
        return;
    }
    if (msg.content === `${prefix}chuck-norris`) {
        getChuckJoke(msg); 
        return;
    }
    if (msg.content === `${prefix}nasa`) {
        getNasaPicOfDay(msg); 
        return;
    }
});

client.on('messageDelete', msg => {
    console.log('Message Deleted', msg); 
});

try {
    client.login(token);
}
catch (err) {
    console.log(err); 
}

async function getCommands(msg) {
    try {
        const exampleEmbed = new Discord.RichEmbed()
            .attachFiles(['./assets/robot.png'])
            .setColor('#0099ff')
            .setTitle('How can I help you?')
            .setURL('https://discord.js.org/')
            .setAuthor('Serrrvo', 'attachment://robot.svg')
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
        const exampleEmbed = new Discord.RichEmbed()
            .attachFiles(['./assets/robot.png'])
            .setColor('#0099ff')
            .setTitle('How can I help you?')
            .setURL('https://discord.js.org/')
            .setAuthor('Serrrvo', 'attachment://robot.svg')
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
        const exampleEmbed = new Discord.RichEmbed()
            .attachFiles(['./assets/robot.png'])
            .setColor('#0099ff')
            .setTitle('How can I help you?')
            .setURL('https://discord.js.org/')
            .setAuthor('Serrrvo')
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
        const exampleEmbed = new Discord.RichEmbed()
            .attachFiles(['./assets/robot.png'])
            .setColor('#0099ff')
            .setTitle('How can I help you?')
            .setURL('https://discord.js.org/')
            .setAuthor('Serrrvo')
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

async function getRandomTrumpQuote(msg) {
    https.get('https://api.tronalddump.io/random/quote', (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {
        const json = JSON.parse(data); 
        console.log('trump-quote', json.value); 
        try {
            const exampleEmbed = new Discord.RichEmbed()
                .attachFiles(['./assets/robot.png'])
                .setColor('#0099ff')
                .setTitle('Trump can\'t help anyone...')
                .setURL('https://discord.js.org/')
                .setAuthor('Serrrvo')
                .setDescription('Your Server Assistant')
                .setThumbnail('attachment://robot.png')
                .addField('Trump Quote', json.value)
                .setTimestamp()
                .setFooter(`${prefix}trump`);
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
            const exampleEmbed = new Discord.RichEmbed()
                .attachFiles(['./assets/robot.png'])
                .setColor('#0099ff')
                .setTitle('Fucking Chuck Norris!')
                .setURL('https://discord.js.org/')
                .setAuthor('Serrrvo')
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
            const exampleEmbed = new Discord.RichEmbed()
                .attachFiles(['./assets/robot.png'])
                .setColor('#0099ff')
                .setTitle(json.title)
                .setURL('https://discord.js.org/')
                .setAuthor('Serrrvo')
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

async function getPokemonFromHint(msg, hint) {
    let possiblePokemon = []; 
    const hintLenth = hint.length;

    pokedex.forEach((obj) =>  { 
        let pokemon = obj.name.english.toString();  
 
        if (pokemon.length == hintLenth) {
            const pokeArray = Array.from(new Set(pokemon.split(','))).toString();
            const hintArray = Array.from(new Set(hint.split(','))).toString();

            let match = false; 
            for (let i = 0; i < pokeArray.length; i++) {

                const pokeLetter = pokeArray[i]; 
                const hintLetter = hintArray[i]; 

                if (hintLetter === '_' || pokeLetter === hintLetter) {
                    match = true; 
                } else {
                    match = false; 
                    break; 
                }
            }
            if (match) {
                possiblePokemon.push({ id: obj.id, name: obj.name.english}); 
            }
        }
    });
    console.log('Possible Pokemon:', possiblePokemon); 

    if (possiblePokemon.length < 1) {
        msg.reply('No Match found...'); 
        return; 
    }
    // Theres a limit on how many rich embeds we can do at a time, 10 maybe? Better go 9
    if (possiblePokemon.length < 10) {
        const richContent = getRichPokemon(possiblePokemon)
        .setDescription(`(Hint: ${hint})`); 
        msg.reply(richContent); 
    } else {
        let messageReply = ''; 
        possiblePokemon.forEach((pokemon) => {
            messageReply += `${pokemon.name}\n`
        }); 
        msg.reply(messageReply); 
    }
    
}

function getRichPokemon(possiblePokemon) {
    const thumbnails = getThumbnails(possiblePokemon); 
    const richPokemon = new Discord.RichEmbed()
        .setTitle('Pokedex Search Results:')
        .setColor('#0099ff')
        .attachFiles(thumbnails)
        .setTimestamp()
        .setFooter(`${prefix}pdex`); 

    possiblePokemon.forEach((pokemon, index) => {
        richPokemon
        .addField(`${index + 1}`, `p!catch ${pokemon.name}`, true); 
    }); 
    return richPokemon; 
}

function getThumbnails(possiblePokemon) {
    let fileLocations = []; 
    possiblePokemon.forEach((pokemon) => {
        let id = pokemon.id; 
        if (id < 100) {
            id = `0${id}`; 
        }
        fileLocations.push(`./assets/thumbnails/${id}.png`)
    });
    return fileLocations; 
}

async function getPokemonImageData(url) {
    https.get(url, (resp) => {
    let data = '';

    // A chunk of data has been recieved.
    resp.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on('end', () => {  
        console.log('Image Data Received!'); 
        return data; 
    });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });
}  
