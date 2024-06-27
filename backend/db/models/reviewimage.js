"use strict";
const { Model } = require("sequelize");
const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ReviewImage.belongsTo(models.Review, {
        foreignKey: "reviewId",
        onDelete: "CASCADE",
      });
    }
  }
  ReviewImage.init(
    {
      reviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "ReviewImage",
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
  return ReviewImage;
};
