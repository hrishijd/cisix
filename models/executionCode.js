var Sequelize = require('sequelize');
var sequelize = require('../../Express Database/connection');

var executionCode = sequelize.define('executionCode', {
  executionId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  userId: {
    type: Sequelize.INTEGER,
  },
  executionBlockNo: {
    type: Sequelize.STRING,
  },
  executionBlockState: {
    type: Sequelize.STRING,
  },
  executionChainIds: {
    type: Sequelize.INTEGER,
  },
}, {
  createdAt: true,
  updatedAt: true,
  freezeTableName: true,
  timestamps: true,
  logging: false,
});

// sequelize.sync({ alter: true });
module.exports = executionCode;
