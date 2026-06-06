function sanitizeString(value) {
  if (typeof value !== 'string') {
    return value;
  }

  return value
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '');
}

function sanitizeValue(value) {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === 'object') {
    return sanitizeObject(value);
  }

  return value;
}

function sanitizeObject(obj) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    result[key] = sanitizeValue(value);
  }

  return result;
}

function sanitizeMiddleware(req, res, next) {
  if (req.body && typeof req.body === 'object' && !Array.isArray(req.body)) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    for (const key of Object.keys(req.query)) {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    }
  }

  next();
}

module.exports = sanitizeMiddleware;
