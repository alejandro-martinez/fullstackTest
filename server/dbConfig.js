var config = require('config.js');
var Sequelize = require('sequelize');
var dbOptions = {
	logging: console.log,
	define: {
		timestamps: false
	}
};
var sequelize = new Sequelize(config.database, config.username, config.password, dbOptions);

exports.sequelize = sequelize;