const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      trim: true,
      unique: true,
      minLength: [5, "Error"],
      maxLength: [40, "A tour name"]
      // validate: [validator.isAlpha, "Tour name must only contain characters"]
    },
    duration: {
      type: Number,
      required: [true, "A tour must have duration."]
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a max group size"]
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have difficulty."],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Invalid"
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Greater than 1 please"],
      max: [5, "No below than 5"]
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"]
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //this points to current doc.
          return val < this.price;
        },
        message: "Discount must be below regular price bro."
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description."]
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, "Must have image cover."]
    },
    images: {
      type: [String]
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});

//Document Middleware : runs before save command. and create
//Not on insert many
// tourSchema.pre("save", function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
// tourSchema.pre("save", function(next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });
// tourSchema.post("save", function(doc, next) {
//   console.log(doc);
//   next();
// });

tourSchema.pre("find", function(next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
