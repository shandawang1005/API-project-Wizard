const router = require("express").Router(); // Required to set new table
const {
  setTokenCookie,
  restoreUser,
  requireAuth,
} = require("../../utils/auth.js");
const { Sequelize } = require("sequelize");
const { Spot, Review, SpotImage, User, Booking } = require("../../db/models");
const { Op } = require("sequelize");
//////////////////PUT//////////////////////

///Edit booking
router.put("/:bookingId", requireAuth, async (req, res, next) => {
  const { user } = req;
  const bookingId = req.params.bookingId;
  const { startDate, endDate } = req.body;
  try {
    // Find the booking to be edited
    const theBooking = await Booking.findByPk(bookingId);

    if (!theBooking) {
      // If the booking doesn't exist, return a 404 error
      return res.status(404).json({
        message: "Booking couldn't be found",
      });
    }

    if (theBooking.userId !== user.id) {
      // If the user is not the owner of the booking, return a 403 error
      return res.status(403).json({
        message: "Forbidden: You cannot edit this booking",
      });
    }

    const now = new Date(); // Current date and time
    const start = new Date(startDate); // Parsed start date from the request body
    const end = new Date(endDate); // Parsed end date from the request body

    if (new Date(theBooking.endDate) < now) {
      // If the booking has already ended, return a 403 error
      return res
        .status(403)
        .json({ message: "Past bookings cannot be modified." });
    }

    if (start < now) {
      // If the new start date is in the past, return a 400 error
      return res.status(400).json({
        message: "Validation error",
        errors: {
          startDate: "startDate cannot be in the past",
        },
      });
    }

    if (end <= start) {
      // If the new end date is before or on the same day as the new start date, return a 400 error
      return res.status(400).json({
        message: "Validation error",
        errors: {
          endDate: "endDate cannot be on or before startDate",
        },
      });
    }

    // Check for booking conflicts
    const conflictingBookings = await Booking.findAll({
      where: {
        spotId: theBooking.spotId, // Ensure we're checking bookings for the same spot
        id: { [Op.ne]: bookingId }, // Exclude the current booking from conflict check
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [start, end],
            },
          },
          {
            endDate: {
              [Op.between]: [start, end],
            },
          },
          {
            [Op.and]: [
              {
                startDate: {
                  [Op.lte]: start,
                },
              },
              {
                endDate: {
                  [Op.gte]: end,
                },
              },
            ],
          },
          {
            endDate: {
              [Op.eq]: start,
            },
          },
        ],
      },
    });

    if (conflictingBookings.length > 0) {
      // If there are any conflicting bookings, return a 403 error
      return res.status(403).json({
        message: "Sorry, this spot is already booked for the specified dates",
        errors: {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        },
      });
    }

    // Update the booking with the new dates
    const updatedBooking = await theBooking.update({ startDate, endDate });

    // Return the updated booking
    res.status(200).json(updatedBooking);
  } catch (err) {
    // Handle any unexpected errors
    res.status(500).json({
      message: "Internal server error",
      errors: err.message,
    });
    next(err);
  }
});

///////////////////GET//////////////////////

//Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res, next) => {
  const { user } = req;
  const Bookings = await Booking.findAll({
    where: { userId: user.id },
    include: [
      {
        model: Spot,
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
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
    ],
  });
  if (!Booking) {
    return res
      .status(404)
      .json({ message: "You don't have any upcoming bookings." });
  }
  const formattedBookings = Bookings.map((booking) => {
    const bookingJson = booking.toJSON();
    if (bookingJson.Spot) {
      const spotJson = bookingJson.Spot;
      let previewImage = null;
      if (spotJson.SpotImages && spotJson.SpotImages.length > 0) {
        previewImage = spotJson.SpotImages[0].url;
      }
      bookingJson.Spot = { ...spotJson, previewImage: previewImage };
      delete bookingJson.Spot.SpotImages;
    }
    return bookingJson;
  });

  res.status(200).json(formattedBookings);
});

/////////////DELETE////////////////////////
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
  try {
    const { user } = req;
    const bookingId = req.params.bookingId;
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({
        message: "Booking couldn't be found",
      });
    }
    if (booking.userId !== user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    }
    const now = new Date();
    if (booking.startDate <= now) {
      return res.status(403).json({
        message: "Bookings that have been started can't be deleted",
      });
    }
    await booking.destroy();
    res.status(200).json({
      message: "Successfully deleted",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router; // Required to set new table
