import { celebrate, Joi, Segments } from 'celebrate';

export const postValid = Joi.object({
  name: Joi.string().min(2).max(30),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const registrationValidator = celebrate({
  [Segments.BODY]: postValid,
});
