'use strict';
module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define('users', {
    username: DataTypes.STRING,
    password: DataTypes.TEXT,
    salt: DataTypes.STRING
  }, {});
  users.associate = function (models) {
    users.hasMany(models.snippets, {as: 'snippets', foreignKey: 'userid'});
    users.hasMany(models.tags, {as:"tags", foreignKey: "userid"});
  }
  return users;
};
