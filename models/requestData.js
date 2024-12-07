import { DataTypes } from 'sequelize';
import sequelize from '../../Express Database/connection';

const requestData = sequelize.define('requestData', {
  requesestId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  requestTockenUsed: {
    type: DataTypes.INTEGER,
  },
  requestData: {
    type: DataTypes.STRING,
  },
  responseState: {
    type: DataTypes.STRING,
  },
}, {
  createdAt: true,
  updatedAt: true,
  freezeTableName: true,
  timestamps: true,
  logging: false,

});

// sequelize.sync({ alter: true });
export default requestData;