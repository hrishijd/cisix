// models/executionCode.js
const { DataTypes } = require('sequelize');
const sequelize = require('../connection'); // Adjust path as needed

const ExecutionCode = sequelize.define('ExecutionCodes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  useremail: {
    type: DataTypes.STRING,
    allowNull: true
  },
  executionBlockNo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  executionFileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  executionAkaveID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  executionBlockState: {
    type: DataTypes.STRING,
    allowNull: false
  },
  executionChainIds: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'ExecutionCodes'
});

module.exports = ExecutionCode;