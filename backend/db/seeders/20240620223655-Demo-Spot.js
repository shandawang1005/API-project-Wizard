"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Spot.bulkCreate(
      [
        {
          ownerId: 1,
          address: "Hogwarts Castle",
          city: "Hogsmeade",
          state: "Scotland",
          country: "UK",
          lat: 56.8182,
          lng: -5.0093,
          name: "Hogwarts School of Witchcraft and Wizardry",
          description:
            "A magical place where young wizards and witches come to learn and master their magical abilities.",
          price: 5000,
        },
        {
          ownerId: 2,
          address: "12 Grimmauld Place",
          city: "London",
          state: "England",
          country: "UK",
          lat: 51.5154,
          lng: -0.0911,
          name: "Sirius Black's House",
          description:
            "A hidden magical house and the headquarters for the Order of the Phoenix.",
          price: 3000,
        },
        {
          ownerId: 3,
          address: "The Burrow",
          city: "Ottery St Catchpole",
          state: "Devon",
          country: "UK",
          lat: 50.7832,
          lng: -3.6536,
          name: "The Weasley's Home",
          description:
            "A cozy and warm family home of the Weasley family, full of magical surprises.",
          price: 1500,
        },
        {
          ownerId: 4,
          address: "Malfoy Manor",
          city: "Wiltshire",
          state: "England",
          country: "UK",
          lat: 51.285,
          lng: -1.865,
          name: "Malfoy Family Mansion",
          description:
            "A grand and opulent manor belonging to the Malfoy family, with a dark history.",
          price: 8000,
        },
        {
          ownerId: 5,
          address: "Hagrid's Hut",
          city: "Hogsmeade",
          state: "Scotland",
          country: "UK",
          lat: 56.8182,
          lng: -5.0093,
          name: "Rubeus Hagrid's Hut",
          description:
            "A small and cozy hut on the grounds of Hogwarts, home to the lovable gamekeeper, Hagrid.",
          price: 800,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        address: {
          [Op.in]: [
            "Hogwarts Castle",
            "12 Grimmauld Place",
            "The Burrow",
            "Malfoy Manor",
            "Hagrid's Hut",
          ],
        },
      },
      {}
    );
  },
};
