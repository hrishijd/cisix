import { DataTypes } from 'sequelize';
import sequelize from '../../Express Database/connection';

const blobs = sequelize.define('blobs', {
  blobId: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userId: {
    type: DataTypes.INTEGER,
  },
  executionId: {
    type: DataTypes.INTEGER,
  },
  executionBlockState: {
    type: DataTypes.STRING,
  },
  executionChainIds: {
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
export default blobs;