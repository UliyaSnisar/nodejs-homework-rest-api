const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const {ValidLengthOfContactName} = require('../../config/constant')

const patternPhone =
  "\\+?\\d{1,4}?[-.\\s]?\\(?\\d{1,3}?\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}";

const schemaContact = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(ValidLengthOfContactName.MIN_LENGTH_OF_NAME)
    .max(ValidLengthOfContactName.MAX_LENGTH_OF_NAME)
    .required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(new RegExp(patternPhone)).required(),
  favorite: Joi.boolean().optional(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string()
    .min(ValidLengthOfContactName.MIN_LENGTH_OF_NAME)
    .max(ValidLengthOfContactName.MAX_LENGTH_OF_NAME)
    .optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(new RegExp(patternPhone)).optional(),
  favorite: Joi.boolean().optional(),
}).min(1);

const schemaStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemaId = Joi.object({
  contactId: Joi.objectId().required(),
});

const validate = async (schema, obj, res, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: `Field ${err.message.replace(/"/g, "")}`,
    });
  }
};

module.exports.validateContact = async (req, res, next) => {
    return await validate(schemaContact, req.body, res, next)
}

module.exports.validateUpdateContact = async (req, res, next) => {
  return await validate(schemaUpdateContact, req.body, res, next);
};

module.exports.validateStatusContact = async (req, res, next) => {
  return await validate(schemaStatusContact, req.body, res, next);
};

module.exports.validateId = async (req, res, next) => {
  return await validate(schemaId, req.params, res, next);
};