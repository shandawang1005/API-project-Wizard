"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "https://example.com/hogwarts1.jpg",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://example.com/hogwarts2.jpg",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://example.com/grimmauld1.jpg",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://example.com/grimmauld2.jpg",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://example.com/burrow1.jpg",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://example.com/burrow2.jpg",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://example.com/malfoy1.jpg",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://example.com/malfoy2.jpg",
          preview: false,
        },
        {
          spotId: 5,
          url: "https://example.com/hagrid1.jpg",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://example.com/hagrid2.jpg",
          preview: false,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3, 4, 5] },
      },
      {}
    );
  },
};
