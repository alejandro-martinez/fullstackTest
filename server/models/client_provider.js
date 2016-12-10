/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  var ClientProvider = sequelize.define('client_provider', {
    client_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'client',
        key: 'id'
      }
    },
    provider_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'provider',
        key: 'id'
      }
    }
  }, {
    tableName: 'client_provider',
    timestamps: false
  });

  return ClientProvider;
};
