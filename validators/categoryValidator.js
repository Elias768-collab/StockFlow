import joi from "joi";

const categorySchema = joi.object({

    // Category name
    name: joi.string()
        .trim()
        .min(3)
        .max(100)
        .required(),

    // Category description
    description: joi.string()
        .trim()
        .allow("")
        .optional(),

    // Category status
    status: joi.string()
        .valid("active", "inactive")
        .optional()
});

export default categorySchema