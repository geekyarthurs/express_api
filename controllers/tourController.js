const fs = require("fs");
const Tour = require("./../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
exports.aliasTopTours = (req, res, next) => {
  (req.query.limit = "5"),
    (req.query.sort = "-ratingsAverage,price"),
    (req.query.fields = "name,price,ratingsAverage,summary,difficulty");
  next();
};

// ROUTE HANDLERS
exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "Tour not found."
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    return res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      data: null
    });
  }
};

exports.deleteTour = (req, res) => {
  Tour.findByIdAndRemove(req.params.id)
    .then(() => {
      return res.status(200).json({
        status: "success",
        data: null
      });
    })
    .catch(err => {
      return res.status(200).json({
        status: "error",
        message: "Failed to delete tour."
      });
    });
};

// exports.checkPost = (req, res, next) => {
//   console.log(req.body.name);
//   console.log(req.body.price);
//   if (typeof req.body.name == "string" && typeof req.body.price == "number") {
//     next();
//   } else {
//     return res.status(400).json({
//       status: "error",
//       message: "invalid data"
//     });
//   }
// };

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        $sort: { avgPrice: 1 }
      },
      {
        $match: {
          _id: { $ne: "easy" }
        }
      }
    ]);

    console.log(stats);
    res.status(200).json({
      status: "success",
      stats
    });
  } catch (err) {}
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates"
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-30`)
          }
        }
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: {
            $push: "$name"
          }
        }
      },
      {
        $addFields: {
          month: "$_id"
        }
      },
      {
        $sort: {
          _id: 1
        }
      },
      {
        $project:{
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      status: "success",
      plan
    });
  } catch (err) {}
};
