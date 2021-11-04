const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const { HttpCode, Subscription } = require('../../config/constants')

const patternPassword = '^[a-zA-Z0-9]{3,30}$'

const schemaSignupUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).pattern(new RegExp(patternPassword)).required(),
  subscription: Joi.string().valid(Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS).optional(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).pattern(new RegExp(patternPassword)).required(),
});

const schemaSubscriptionUser = Joi.object({
  subscription: Joi.string()
    .valid(Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS)
    .required(),
});

const validate = async (schema, obj, res, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    res.status(HttpCode.BAD_REQUEST).json({
      status: "error",
      code: HttpCode.BAD_REQUEST,
      message: `Field ${err.message.replace(/"/g, "")}`,
    });
  }
};

module.exports.validateSignupUser = async (req, res, next) => {
  return await validate(validateSignupUser, req.body, res, next);
};

module.exports.schemaLoginUser = async (req, res, next) => {
  return await validate(schemaLoginUser, req.body, res, next);
};

module.exports.validateSubscriptionUser = async (req, res, next) => {
  return await validate(schemaSubscriptionUser, req.body, res, next);
};