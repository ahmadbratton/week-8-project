'use strict';
module.exports = function(sequelize, DataTypes) {
  var tags = sequelize.define('tags', {
    userid: DataTypes.INTEGER,
    tag: DataTypes.STRING,
    snippetid: DataTypes.INTEGER
  }, {});
  tags.associate = function (models) {
    tags.belongsTo(models.users, {as:"users", foreignKey: "userid"});
    tags.belongsTo(models.snippets, {as:"snippets", foreignKey:"snippetid"})
  }
  return tags;
};
