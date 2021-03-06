/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('client', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'client',
    classMethods: {
      getMsgError: function( name ) {
        var msg = "";
        switch( name ) {
          case 'SequelizeUniqueConstraintError':
          msg = "That email is already registered";
          break;
        }
        return msg;
      }
    }
  });
};
