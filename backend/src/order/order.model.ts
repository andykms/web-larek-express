import { Joi } from 'celebrate';

export const orderValidSchema = Joi.object({
    items: Joi.array().items(Joi.string()).min(1).required(),
    total: Joi.number().required(),
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
});
