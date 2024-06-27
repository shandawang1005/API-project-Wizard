"use strict";
const { Model } = require("sequelize");
const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.Spot, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
      Booking.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Booking.init(
    {
      spotId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isAfter: {
            args: new Date().toISOString().split("T")[0],
            msg: "Start date must be in the future",
          },
        },
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          afterStart(date) {
            if (new Date(date) <= new Date(this.startDate)) {
              throw new Error("End Date has to be AFTER Start Date");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Booking",
      getterMethods: {
        createdAt() {
          const rawValue = this.getDataValue("createdAt");
          return moment(rawValue).format("YYYY-MM-DD HH:mm:ss");
        },
        updatedAt() {
          const rawValue = this.getDataValue("updatedAt");
          return moment(rawValue).format("YYYY-MM-DD HH:mm:ss");
        },
      },
    }
  );
  return Booking;
};
