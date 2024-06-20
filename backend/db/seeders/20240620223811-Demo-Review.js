"use strict";

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Review.bulkCreate(
      [
        {
          spotId: 1,
          userId: 1,
          review:
            "Hogwarts is absolutely magical! The castle is breathtaking, and the atmosphere is like no other. A must-visit for any witch or wizard.",
          stars: 5,
        },
        {
          spotId: 2,
          userId: 2,
          review:
            "Grimmauld Place is full of history and mystery. It was fascinating to explore the hidden rooms and secret passages.",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 3,
          review:
            "The Burrow is the coziest place I've ever stayed. The Weasleys are wonderful hosts, and the house is full of charm and magic.",
          stars: 5,
        },
        {
          spotId: 4,
          userId: 4,
          review:
            "Malfoy Manor is grand but has a dark vibe. The architecture is impressive, but it feels a bit too ominous for my taste.",
          stars: 3,
        },
        {
          spotId: 5,
          userId: 5,
          review:
            "Hagrid's Hut is simple but cozy. Perfect for those who love nature and don't mind a bit of rustic living. Hagrid is a great host!",
          stars: 4,
        },
        {
          spotId: 1,
          userId: 2,
          review:
            "I loved every moment at Hogwarts! The Great Hall is stunning, and the enchanted ceilings are a sight to behold.",
          stars: 5,
        },
        {
          spotId: 2,
          userId: 3,
          review:
            "Staying at Grimmauld Place was an intriguing experience. The house has so many stories to tell, and the magical elements were fascinating.",
          stars: 4,
        },
        {
          spotId: 3,
          userId: 4,
          review:
            "The Burrow feels like home. It's warm, inviting, and full of love. The perfect getaway from the hustle and bustle of the city.",
          stars: 5,
        },
        {
          spotId: 4,
          userId: 1,
          review:
            "Malfoy Manor is luxurious but eerie. The grandeur is undeniable, but the dark history is palpable.",
          stars: 3,
        },
        {
          spotId: 5,
          userId: 2,
          review:
            "Hagrid's Hut is a unique experience. It's a bit rough around the edges, but Hagrid's hospitality makes up for it.",
          stars: 4,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
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
