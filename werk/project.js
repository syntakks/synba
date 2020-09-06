const { prefix } = require('../config.json');

// project
// !werk project new <projectName>  # Creates new Project, creates ProjectUser entry with owner role.
// !werk project new <projectName> start  # Creates new Project, creates ProjectUser entry with owner role and new Session right now.
// !werk project edit <projectID> name <name> String
// !werk project edit <projectID> completed <completed> Datetime
// !werk project delete <projectID>  # Delete project by ID.
// !werk project addUser <projectID> <username/mention> role <roleID> # Adds user to project. Optional role, default to team.
// !werk project editUser <projectID> <username/mention> <roleID>  #Edit user role for project.
// !werk project kickUser <projectID> <username/mention>  # Remove user from project.
// !werk project list  # Shows list of any projects visible to my user in ProjectUser

module.exports.handle = async (db, messageEmbed, message, args) => {
  switch (args[1]) {
    case 'new':
      if (!args[2] || args[2].length < 1) {
        message.reply('You must specify a project name!');
        return;
      } else {
        return await newProject(db, messageEmbed, message, args);
      }
    case 'list':
      return await listProjects(db, messageEmbed, message, args);
    case 'delete':
      return await deleteProject(db, messageEmbed, message, args);
  }

  async function newProject(db, messageEmbed, message, args) {
    try {
      // Create Project in Database
      // Create ProjectUser entry with the id of this insert
      let projectName = args[2];
      db.beginTransaction(function (err) {
        if (err) {
          throw err;
        }
        let project = { name: projectName };
        let projectInsert = db.query(
          'INSERT INTO project SET ?',
          project,
          function (error, results, fields) {
            if (error) {
              return db.rollback(function () {
                throw error;
              });
            }
            console.log('projectInsert', projectInsert);
            let userID = getAuthorUsername(message);
            let ownerRole = 1;
            let project_user = {
              projectID: results.insertId,
              userID: userID,
              roleID: ownerRole,
            };
            let projectUserInsert = db.query(
              'INSERT INTO project_user SET ?',
              project_user,
              function (error, results, fields) {
                if (error) {
                  return db.rollback(function () {
                    throw error;
                  });
                }
                db.commit(function (err) {
                  if (err) {
                    return db.rollback(function () {
                      throw err;
                    });
                  }
                  console.log('CREATE Project SUCCESS!');
                  messageEmbed.addField('Project Name:', `${args[2]}`, true);
                  messageEmbed.addField(
                    'Project ID:',
                    project_user.projectID,
                    true
                  );
                  messageEmbed.setDescription('CREATE New Project...');
                  messageEmbed.addField(
                    'Created by:',
                    `${message.author.username}#${message.author.discriminator}`,
                    true
                  );
                  messageEmbed.setFooter(`${prefix}werk Created New Project`);
                  messageEmbed.setTimestamp();
                  // Send the reply
                  message.reply(messageEmbed);
                });
              }
            );
          }
        );
      });
    } catch (error) {
      message.reply(error);
    }
  }

  async function listProjects(db, messageEmbed, message, args) {
    try {
      // Create Project in Database
      let sql = `SELECT * from project join project_user on project.projectID = project_user.projectID where project_user.userID = '${getAuthorUsername(
        message
      )}'`;
      db.query(sql, function (error, results, fields) {
        if (error) {
          message.reply(error.sqlMessage);
        } else {
          console.log('results', results);
          results.forEach((project) => {
            messageEmbed.addFields(
              { name: 'Project Name:', value: project.name, inline: true },
              { name: 'Project ID:', value: project.projectID, inline: true },
              { name: 'Creation:', value: project.created, inline: true }
            );
          });
          messageEmbed.setDescription('GET ALL Projects...');
          messageEmbed.addField(
            'Requested by:',
            `${message.author.username}#${message.author.discriminator}`,
            true
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

  async function deleteProject(db, messageEmbed, message, args) {
    try {
      let projectID = args[2];
      let sql = `SELECT * from project join project_user on project.projectID = project_user.projectID where project_user.userID = '${getAuthorUsername(
        message
      )}' and project_user.roleID = 1 and project.projectID = '${projectID}'`;
      console.log(sql);
      // See if we have a row to delete
      db.beginTransaction(function (err) {
        if (err) {
          throw err;
        }

        db.query(sql, function (error, results, fields) {
          if (error) {
            return db.rollback(function () {
              throw error;
            });
          }
          console.log('predeleteresult: ', results);
          if (results.length < 1) {
            return message.reply('No record found...');
          }
          let data = results[0];
          let project = { projectID: data.projectID, name: data.name };

          var log = 'Post ' + results.insertId + ' added';

          db.query(
            'DELETE FROM `project` WHERE `projectID` = ?',
            project.projectID,
            function (error, results, fields) {
              if (error) {
                return db.rollback(function () {
                  throw error;
                });
              }
              db.commit(function (err) {
                if (err) {
                  return db.rollback(function () {
                    throw err;
                  });
                }
                console.log('success!');
                messageEmbed.addField('Project ID:', project.projectID);
                messageEmbed.addField('Project Name:', project.name);
                messageEmbed.setDescription(`DELETE Project...`);
                messageEmbed.addField('Deleted Row(s):', results.affectedRows);
                messageEmbed.addField(
                  'Deleted by:',
                  `${message.author.username}#${message.author.discriminator}`,
                  true
                );
                messageEmbed.setFooter(`${prefix}werk DELETE Project`);
                messageEmbed.setTimestamp();
                // Send the reply
                message.reply(messageEmbed);
              });
            }
          );
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  //END

  function getAuthorUsername(message) {
    return `${message.author.username}#${message.author.discriminator}`;
  }
};
