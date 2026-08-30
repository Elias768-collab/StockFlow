import Joi from "joi";

const productQuerySchema = Joi.object({
    search: Joi.string()
        .trim()
        .optional(),

    category: Joi.number()
        .integer()
        .positive()
        .optional(),

    status: Joi.string()
        .valid("active", "inactive")
        .optional(),

    page: Joi.number()
        .integer()
        .positive()
        .optional(),

    limit: Joi.number()
        .integer()
        .positive()
        .optional()

});

export default productQuerySchema;