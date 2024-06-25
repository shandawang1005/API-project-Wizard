"use strict";

const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await Booking.bulkCreate(
      [
        {
          spotId: 1,
          userId: 2,
          startDate: "2024-07-01",
          endDate: "2024-07-10",
        },
        {
          spotId: 2,
          userId: 1,
          startDate: "2024-08-01",
          endDate: "2024-08-15",
        },
        {
          spotId: 3,
          userId: 4,
          startDate: "2024-09-01",
          endDate: "2024-09-10",
        },
        {
          spotId: 1,
          userId: 3,
          startDate: "2024-10-01",
          endDate: "2024-10-05",
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        spotId: { [Op.in]: [1, 2, 3] },
      },
      {}
    );
  },
};
