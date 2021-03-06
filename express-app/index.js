const Joi = require("joi");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv/config");
const inventory = require("./model/mongoMod");

app.use(express.json());

// request validation
const pattern = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
const schema = Joi.object({
  startDate: Joi.string().regex(pattern).required(),
  endDate: Joi.string().regex(pattern).required(),
  minCount: Joi.number().integer().required(),
  maxCount: Joi.number().integer().required(),
});

// mongo connection
mongoose.connect(
  process.env.DBCONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected to DB")
);

// Post call
app.post("/", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      code: 1,
      msg: "Invalid request",
      records: error.details[0].message,
    });
  }
  try {
    const result = await inventory.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(req.body.startDate),
            $lt: new Date(req.body.endDate),
          },
        },
      },
      {
        $group: {
          _id: "$key",
          key: { $first: "$key" },
          createdAt: { $first: "$createdAt" },
          totalCount: { $first: { $sum: "$counts" } },
        },
      },
      {
        $match: {
          totalCount: { $gt: parseInt(req.body.minCount), $lt: parseInt(req.body.maxCount) },
        },
      },
      { $project: { _id: 0 } },
    ]);
    return res.send({
      code: 0,
      msg: "Success",
      records: result,
    });
  } catch (err) {
    return res.send({
      code: 2,
      msg: "Runtime error",
      records: result,
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
