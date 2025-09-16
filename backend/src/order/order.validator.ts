import { Joi } from 'celebrate';
import { Segments, celebrate } from 'celebrate';

const postSchema = Joi.object({
    items: Joi.array().items(Joi.string()).min(1).required(),
    total: Joi.number().required(),
    payment: Joi.string().valid('card', 'online').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
});

export const orderRouteValidator = celebrate({
    [Segments.BODY]: postSchema,
});
