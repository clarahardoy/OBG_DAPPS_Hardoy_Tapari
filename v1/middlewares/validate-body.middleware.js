export const validateBodyMiddleware = (schema) => (req, res, next) => {
	const { error, value } = schema.validate(req.body);
	if (error) {
		return res
			.status(400)
			.json({ error: error.message, details: error.details });
	}
	req.body = value;
	next();
};
