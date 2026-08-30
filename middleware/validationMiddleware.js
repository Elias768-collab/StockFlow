// Recieves the schema
const validate = (schema, source = "body") => {
    return (req, res, next) => {

        // Decide where data should come fro,
        const data = req[source];

        // Validate the selected request against rules in schema
        const { error } = schema.validate(data);

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