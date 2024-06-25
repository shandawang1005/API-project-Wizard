const router = require("express").Router(); // Required to set new table
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
} = require("../../db/models");
const { Op } = require("sequelize");
///////////////PUT///////////////////////
//Edit a review
router.put("/:reviewId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { review, stars } = req.body;
  const reviewId = req.params.reviewId;
  const theReview = await Review.findByPk(reviewId);
  if (!theReview) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }
  if (theReview.userId !== user.id) {
    return res.status(403).json({
      message: "You do not have permission to update this review",
    });
  }
  const errors = {};

  if (!review || typeof review !== "string") {
    errors.review = "Review text is required";
  }

  if (
    typeof stars !== "number" ||
    !Number.isInteger(stars) ||
    stars < 1 ||
    stars > 5
  ) {
    errors.stars = "Stars must be an integer from 1 to 5";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  const updatedReview = await theReview.update({ review, stars });

  res.json(updatedReview);
});

////////////////POST/////////////////////
//Add image to review based on review ID
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { url } = req.body;
  const { reviewId } = req.params;
  const review = await Review.findByPk(reviewId);
  if (!review) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }
  if (review.userId !== user.id) {
    return res.status(403).json({
      message: "You do not have permission to add images to this review",
    });
  }
  const getAllImages = await ReviewImage.findAll({
    where: { reviewId: reviewId },
  });
  if (getAllImages.length >= 10) {
    return res.status(403).json({
      message: "Maximum number of images for this resource was reached",
    });
  }
  const reviewImage = await ReviewImage.create({ reviewId, url });
  res.status(200).json({ id: reviewImage.id, url: reviewImage.url });
});

///////////////////GET/////////////////////

//Get Current User's Review//
router.get("/current", requireAuth, async (req, res, next) => {
  const { user } = req;
  const Reviews = await user.getReviews({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Spot,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: SpotImage,
            attributes: ["url"],
            where: { preview: true },
            required: false,
            as: "previewImage",
          },
        ],
      },
      {
        model: ReviewImage,
        attributes: { exclude: ["reviewId", "createdAt", "updatedAt"] },
      },
    ],
  });
  res.json({ Reviews });
});

//////////////DELETE////////////////////
//delete a review based on review ID
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const reviewId = req.params.reviewId;
  const theReview = await Review.findByPk(reviewId);
  if (!theReview) {
    return res.status(404).json({
      message: "Review couldn't be found",
    });
  }
  if (theReview.userId !== user.id) {
    return res.status(403).json({
      message: "You do not have permission to delete to this review",
    });
  }
  await theReview.destroy();
  res.status(200).json({
    message: "Successfully deleted",
  });
});

module.exports = router; // Required to set new table
