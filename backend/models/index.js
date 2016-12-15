"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var env       = process.env.NODE_ENV || "development";
var config    = require(path.join(__dirname, '..', 'config', 'env.json'))[env];
var options = {
	logging: console.log,
	define: {
		timestamps: false
	}
}
var sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, options);
var db        = {};

fs.readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
})
.forEach(function(file) {
  var model = sequelize.import(path.join(__dirname, file));
  db[model.name] = model;
});

// Model relations
db.provider.belongsToMany(db.client, { through: 'client_provider', foreignKey: 'provider_id'});
db.client.belongsToMany(db.provider, { through: 'client_provider', foreignKey: 'client_id'});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;