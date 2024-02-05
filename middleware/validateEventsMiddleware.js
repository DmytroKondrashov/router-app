const Joi = require('joi');

function validateEventsMiddleware(req, res, next) {
  const schema = Joi.object({
    payload: Joi.object().required(),
    possibleDestinations: Joi.array().items(Joi.object().pattern(Joi.string(), Joi.boolean())).required(),
    strategy: Joi.string().optional(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  next();
}

module.exports = validateEventsMiddleware;
