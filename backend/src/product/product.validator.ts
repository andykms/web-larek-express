import { Joi } from 'celebrate';
import { Segments, celebrate } from 'celebrate';

const postSchema = Joi.object({
    title: Joi.string().min(2).max(30).required(),
    image: Joi.object({
        fileName: Joi.string().required(),
        originalName: Joi.string().required(),
    }).required(),
    category: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().min(0).allow(null),
});

const updateSchema = Joi.object({
    title: Joi.string().min(2).max(30),
    image: Joi.object({
        fileName: Joi.string(),
        originalName: Joi.string(),
    }),
    category: Joi.string(),
    description: Joi.string(),
    price: Joi.number().min(0).allow(null),
});

export const productPostValidator = celebrate({
    [Segments.BODY]: postSchema,
});

export const productUpdateValidator = celebrate({
    [Segments.BODY]: updateSchema,
});
