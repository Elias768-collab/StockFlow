
import joi from "joi";

// Validation schema for creating a product
// Validation schema for updating a product
const productSchema = joi.object({
    category_id: joi.number()
        .integer()
        .positive()
        .required(),

    name: joi.string()
        .trim()
        .min(3)
        .max(200)
        .required(),

    sku: joi.string()
        .trim()
        .min(3)
        .max(100)
        .required(),

    description: joi.string()
        .trim()
        .allow("")
        .optional(),

    unit_price: joi.number()
        .min(0)
        .required(),

    quantity_in_stock: joi.number()
        .integer()
        .min(0)
        .required(),

    reorder_level: joi.number()
        .integer()
        .min(0)
        .required(),

    status: joi.string()
        .valid("active", "inactive")
        .optional(),
});


export default productSchema;