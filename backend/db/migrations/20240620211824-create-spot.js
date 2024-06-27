"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "Spots",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        ownerId: {
          type: Sequelize.INTEGER,
          references: { model: "Users" },
          allowNull: false,
          onDelete: "CASCADE",
        },
        address: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        city: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        state: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        country: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        lat: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        lng: {
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        price: {
          type: Sequelize.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.dropTable(options);
  },
};
