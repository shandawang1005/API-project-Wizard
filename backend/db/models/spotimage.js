"use strict";
const { Model } = require("sequelize");
const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SpotImage.belongsTo(models.Spot, {
        foreignKey: "spotId",
        as: "previewImage",
        onDelete: "CASCADE",
      });
    }
  }
  SpotImage.init(
    {
      spotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      preview: { type: DataTypes.BOOLEAN, allowNull: false },
    },
    {
      sequelize,
      modelName: "SpotImage",
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
  return SpotImage;
};
