const express = require('express');
const rateLimiter = require('./middleware/rateLimiter.middleware');
const requestLogger = require('./middleware/requestLogger.middleware');
const userRoute = require('./route/user.route');

const app = express();

app.use(express.json());

//Machine Test
//Create an own middleware
//Create a middleware for rate limiter

app.use(requestLogger);

app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: req => req.ip,
}));

app.use('/user', userRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));