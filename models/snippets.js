'use strict';
module.exports = function(sequelize, DataTypes) {
  var snippets = sequelize.define('snippets', {
    title: DataTypes.STRING,
    body: DataTypes.STRING,
    notes: DataTypes.STRING,
    language: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    stars: DataTypes.INTEGER
  }, {});
  snippets.associate = function (models) {
    snippets.belongsTo(models.users, {as:"users", foreignKey: "userid"});
    snippets.hasMany(models.tags, {as:"tags", foreignKey: "snippetid"});
  }
  return snippets;
};
