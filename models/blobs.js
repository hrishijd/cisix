var Sequelize = require('sequelize');
var sequelize = require('../../Express Database/connection');

var blobs = sequelize.define('blobs', {
  blobId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  userId: {
    type: Sequelize.INTEGER,
  },
  executionId: {
    type: Sequelize.INTEGER,
  },
  executionBlockState: {
    type: Sequelize.STRING,
  },
  executionChainIds: {
    type: Sequelize.STRING,
  },
}, {
  createdAt: true,
  updatedAt: true,
  freezeTableName: true,
  timestamps: true,
  logging: false,
});

// sequelize.sync({ alter: true });
module.exports = blobs;
