const fs = require('fs');
const {
  token,
  prefix,
  dbhost,
  dbuser,
  dbpass,
  dbname,
} = require('./config.json');
const mysql = require('mysql');

const Discord = require('discord.js');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);

  let jsfiles = files.filter((f) => f.split('.').pop() === 'js');
  //console.log('jsfiles', jsfiles);
  if (jsfiles.length < 1) return console.log('No commands to load!');

  jsfiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    //console.log(`${i + 1}: ${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

var db = mysql.createConnection({
  host: dbhost,
  user: dbuser,
  password: dbpass,
  database: dbname,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database!');
  //db.query('show tables', console.log);
});

bot.on('ready', async () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  let link = await bot.generateInvite(['ADMINISTRATOR']);
  console.log(link);
});

bot.on('message', async (message) => {
  if (message.author.bot) return;
  let messageArray = message.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.slice(1);
  console.log('messageArray', messageArray);
  console.log('command', command);
  console.log('args', args);
  if (!command.startsWith(prefix)) return;

  let commandModule = bot.commands.get(command.slice(prefix.length));
  if (commandModule) commandModule.run(bot, db, message, args);
});

bot.on('messageDelete', async (message) => {
  console.log('Message Deleted', message);
});

// Login
try {
  bot.login(token);
} catch (error) {
  console.log(error);
}
