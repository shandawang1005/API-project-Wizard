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

/////////////////POST///////////////////
//Create review based on SpotId, need logIn
router.post("/:spotId/reviews", requireAuth, async (req, res, next) => {
  const { user } = req;
  const spotId = req.params.spotId;
  const { review, stars } = req.body;
  const spot = await Spot.findByPk(spotId);
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  if (!review || typeof review !== "string") {
    return res.status(400).json({
      message: "Review text is required",
    });
  }
  if (!stars || typeof stars !== "number" || stars < 1 || stars > 5) {
    return res.status(400).json({
      message: "Stars must be an integer from 1 to 5",
    });
  }
  const existingReview = await Review.findOne({
    where: {
      userId: user.id,
      spotId: spotId,
    },
  });

  if (existingReview) {
    return res.status(400).json({
      message: "User already has a review for this spot",
    });
  }
  const newReview = await Review.create({
    review,
    stars,
    userId: user.id,
    spotId: spotId,
  });
  res.status(201).json(newReview);
});

//make new spot
router.post("/", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  try {
    const newSpot = await Spot.create({
      ownerId: user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });
    res.status(201).json(newSpot);
  } catch (err) {
    res.status(400);
    next(err);
  }
});
//add imageto spot that belongs to the user
router.post("/:spotId/images", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { spotId } = req.params;
  const { url, preview } = req.body;

  try {
    const spot = await Spot.findByPk(spotId);

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const newImage = await SpotImage.create({
      spotId,
      url,
      preview,
    });

    res.status(200).json(newImage);
  } catch (err) {
    res.status(400);
    next(err);
  }
});

////////////GET//////////////

// router.use(requireAuth); // Everything Below this line need Auth in middleware

//Get Reviews by SpotId//
router.get("/:spotId/reviews", async (req, res, next) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId); //finding Obj by SpotId
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }
  const Reviews = await spot.getReviews({
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: ReviewImage,
        attributes: { exclude: ["reviewId", "createdAt", "updatedAt"] },
      },
    ],
  });

  res.json(Reviews);
});

//get spot owned by current user
router.get("/current", requireAuth, async (req, res) => {
  const { user } = req;
  const spots = await user.getSpots();
  res.json(spots);
});

//get spot by spotId
router.get("/:spotId", async (req, res, next) => {
  const spotId = req.params.spotId;
  const data = await Spot.findByPk(spotId, {
    attributes: {
      include: [
        [Sequelize.fn("COUNT", Sequelize.col("Reviews.id")), "numReviews"],
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgStarRating"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
    ],
  });
  const SpotImages = await SpotImage.findAll({
    where: { spotId: spotId },
    attributes: ["id", "url", "preview"],
    order: [["id", "ASC"]],
  });
  const Owner = await data.getUser({
    attributes: ["id", "firstName", "lastName"],
  });
  res.json({ ...data.toJSON(), SpotImages, Owner });
});

//GET ALL SPOTS//
router.get("/", async (req, res, next) => {
  const spots = await Spot.findAll({
    attributes: {
      include: [
        [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: SpotImage,
        attributes: ["url"],
        where: { preview: true },
        required: false,
        as: "previewImage",
      },
    ],
    group: ["Spot.id", "previewImage.id"],
  });
  res.json({ ...spots });
});

/////////////////////PUT//////////////////////
//Edit a Spot//
router.put("/:spotId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const { spotId } = req.params;
  const UpdatedSpot = await Spot.findByPk(spotId); //find the spot with its ownerId in it
  try {
    if (!UpdatedSpot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
    if (UpdatedSpot.ownerId !== user.id) {
      //compare ownerId
      return res.status(403).json({ message: "Forbidden" });
    }
    // Update the spot with new data
    const updatedData = await UpdatedSpot.update({
      ...req.body,
      updatedAt: new Date(),
    });

    res.status(200).json(updatedData);
  } catch (err) {
    next(err);
  }
});

////////////////DELETE/////////////////
router.delete("/:spotId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const spotId = req.params.spotId;
  try {
    const spot = await Spot.findByPk(spotId); //SpotId Obj with OwnerId
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
    if (spot.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await spot.destroy();
    res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; // Required to set new table
