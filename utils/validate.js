// utils/validate.js
import Joi from 'joi';

export const customerSchema = Joi.object({
  company_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),  // Assuming a minimum password length of 8 characters
  address: Joi.string().required(),
  phone: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),  // Assuming a 10-digit phone number
  rate_table: Joi.object({
    '1-2kg': Joi.number().required(),
    '2-3kg': Joi.number().required(),
    '3-4kg': Joi.number().required()
  }).required()
});
