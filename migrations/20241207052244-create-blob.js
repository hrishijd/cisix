'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blobs', {
      blobId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      walletAddress: {
        type: Sequelize.STRING
      },
      executionId: {
        type: Sequelize.INTEGER
      },
      blockNo: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Blobs');
  }
};