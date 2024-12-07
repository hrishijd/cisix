import { Sequelize } from 'sequelize';

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('postgresql://postgres:iNZJaMIykODvJdErjkMDQiBrCOUBpiwF@autorack.proxy.rlwy.net:15517/railway'); // Example for postgres

try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize; 