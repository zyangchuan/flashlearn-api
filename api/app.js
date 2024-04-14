require('express-async-errors');
const express = require('express');
const app = express();

const errorHandlerMiddleware = require('./middlewares/error-handler');
const notFoundMiddleware = require('./middlewares/not-found');

// packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

app.use(rateLimiter({ windowMs: 1 * 60 * 1000, max: 50 }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'))
app.use(express.json());

// routers
const authRouter = require('./routes/authRouter');
const deckRouter = require('./routes/deckRouter');
const cardRouter = require('./routes/cardRouter');
const studyRouter = require('./routes/studyRouter');
const friendRouter = require('./routes/friendRouter');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/deck', deckRouter);
app.use('/api/v1/card', cardRouter);
app.use('/api/v1/study', studyRouter);
app.use('/api/v1/friend', friendRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});