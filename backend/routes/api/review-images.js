const router = require("express").Router();
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth.js");
const { Sequelize } = require("sequelize");
const {
  Spot,
  Review,
  SpotImage,
  ReviewImage,
  User,
  Booking,
} = require("../../db/models");
/////////////////DELETE//////////////////////

router.delete("/:imageId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const imageId = req.params.imageId;
  const image = await ReviewImage.findByPk(imageId);
  if (!image) {
    return res.status(404).json({
      message: "Review Image couldn't be found",
    });
  }
  const review = await Review.findByPk(image.reviewId); //find the spot id in image (this is the line 22 image)

  //   const spot = await SpotImage.getSpot();
  if (user.id !== review.userId) {
    return res.status(403).json({
      message: "Forbidden: You cannot delete this image",
    });
  }
  await image.destroy();
  res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router; // Required to set new table
