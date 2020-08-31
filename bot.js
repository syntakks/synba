const fs = require('fs');
const { token, prefix } = require('./config.json');
const Discord = require('discord.js');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);

  let jsfiles = files.filter((f) => f.split('.').pop() === 'js');
  console.log('jsfiles', jsfiles);
  if (jsfiles.length < 1) return console.log('No commands to load!');

  jsfiles.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${i + 1}: ${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
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
  if (commandModule) commandModule.run(bot, message, args);
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
