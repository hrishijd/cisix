const Sequelize = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from a .env file
dotenv.config();

// Retrieve PostgreSQL connection details from environment variables
const DATABASE_URL = process.env.DATABASE_URL;

// Ensure DATABASE_URL is defined
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

// Initialize Sequelize using the connection URL
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Disable logging (optional)
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;
