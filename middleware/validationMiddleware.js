// Recieves the schema
const validate = (schema) => {
    return (req, res, next) => {

        // Validate request body against rules in schema
        const { error } = schema.validate(req.body);

        // Stop invalid request
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        // Validation passed, move to the next handler
        next();
    };
};

export default validate;