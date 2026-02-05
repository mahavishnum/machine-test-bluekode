module.exports = function rateLimiter(options = {}) {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    keyGenerator = () => 'globalFallbackIp'
  } = options;

  const store = new Map();

  return function (req, res, next) {
    try {
      const key = keyGenerator(req);
      const now = Date.now();
      let entry = store.get(key);

      if (!entry || now > entry.resetAt) {
        entry = { count: 1, resetAt: now + windowMs };
        store.set(key, entry);
      } else {
        entry.count += 1;
      }

      const remaining = Math.max(0, max - entry.count);

        res.setHeader('X-RateLimit-Limit', String(max));
        res.setHeader('X-RateLimit-Remaining', String(remaining));
        res.setHeader('X-RateLimit-Reset', String(Math.ceil(entry.resetAt / 1000)));

      if (entry.count > max) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
        res.setHeader('Retry-After', String(retryAfter));
        res.status(429).json({ error: "Too many requests, please try again later.", retryAfter });
        return;
      }

      return next();
    } catch (err) {
      next(err);
    }
  };
};