const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const someData = [
{
    "startDate": "2016-01-27",
    "endDate": "2018-02-01",
    "minCount": "2701",
    "maxCount": "3001",
}
];
const pattern = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/
const schema = Joi.object({
    startDate: Joi.string().regex(pattern),
    endDate: Joi.string().regex(pattern),
    minCount: Joi.number()
        .integer(),
    maxCount: Joi.number()
        .integer(),
});

app.post('/api/somedata', (req, res) => {
  const { error } = schema.validate(req.body);
  if (error){
    res.status(400).send(error.details[0].message);
    return;
  }
  const somedata = {
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    minCount: req.body.minCount,
    maxCount: req.body.maxCount
  }
  someData.push(somedata);
  console.log(req.body);
  res.send(someData);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));