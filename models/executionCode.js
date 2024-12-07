import { DataTypes } from 'sequelize';
import sequelize from '../../Express Database/connection';

const executionCode = sequelize.define('executionCode', {
  executionId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  executionBlockNo: {
    type: DataTypes.STRING,
  },
  executionBlockState: {
    type: DataTypes.STRING,
  },
  executionChainIds: {
    type: DataTypes.INTEGER,
  },
}, {
  createdAt: true,
  updatedAt: true,
  freezeTableName: true,
  timestamps: true,
  logging: false,

});

// sequelize.sync({ alter: true });
export default executionCode;