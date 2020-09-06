const { prefix } = require('../config.json');

module.exports.handle = async (db, messageEmbed, message, args) => {
  switch (args[1]) {
    case 'add':
      return await add(db, messageEmbed, message, args);
  }

  async function add(db, messageEmbed, message, args) {
    try {
      let firstMember = message.mentions.members.first();
      if (typeof firstMember === 'undefined') {
        message.reply('You must provide a user mention!');
        console.log('undefined user!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        return;
      }
      let user = firstMember.user;
      console.log('user', user);
      let userID = `${user.username}#${user.discriminator}`;
      var post = { userID: userID };
      db.query('INSERT INTO user SET ?', post, function (
        error,
        results,
        fields
      ) {
        if (error) {
          message.reply(error.sqlMessage);
        }
        //Success
        console.log('addGuildResults: ', results);
        messageEmbed.addFields({
          name: 'Added User:',
          value: userID,
          inline: true,
        });
        messageEmbed.setDescription('ADD Guild Users...');
        messageEmbed.addField(
          'Added by:',
          `${message.author.username}#${message.author.discriminator}`,
          true
        );
        messageEmbed.setFooter(`${prefix}werk USER add`);
        messageEmbed.setTimestamp();
        // Send the reply
        message.reply(messageEmbed);
      });
    } catch (error) {
      message.reply(error);
    }
  }
};
