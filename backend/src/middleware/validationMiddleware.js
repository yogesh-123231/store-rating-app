const { formatZodErrors } = require('../utils/validators');

function validate(schema, property = 'body') {
  return (req, res, next) => {
    const source =
      property === 'body'
        ? req.body
        : property === 'query'
          ? req.query
          : req.params;

    const result = schema.safeParse(source);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: formatZodErrors(result.error),
        },
      });
    }

    if (property === 'body') {
      req.body = result.data;
    } else if (property === 'query') {
      req.validatedQuery = result.data;
    } else {
      req.validatedParams = result.data;
    }

    next();
  };
}

module.exports = validate;
