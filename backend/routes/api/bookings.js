const router = require("express").Router(); // Required to set new table
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth.js");
const { Sequelize } = require("sequelize");
const { Spot, Review, SpotImage,User } = require("../../db/models");

module.exports = router; // Required to set new table