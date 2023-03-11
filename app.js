const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const compression = require('compression');

// APP ERROR
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController.controller');

// ROUTERS
const userRouter = require('./routes/user.route');
const inscriptionRouter = require('./routes/inscription.route');
const paymentRouter = require('./routes/payment.route');
const courseRouter = require('./routes/course.route');
const topicsRouter = require('./routes/topics.route');
const programRouter = require('./routes/program.route');
const adminRouter = require('./routes/admin.route');
const viewRouter = require('./routes/views.route');

const app = express();

app.enable('trust proxy');

// ENGINE IN CASE WE DECIDE TO USE A TEMPLATE ENGINE
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.options('*', cors());

// SERVING STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));

// GLOBAL MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// SECURITY HEADERS
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
            baseUri: ["'self'"],
            fontSrc: ["'self'", 'https:', 'http:', 'data:'],
            scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
            imgSrc: ["'self'", 'data:', 'blob:'],
        },
    })
);

// BODY PARSER
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extnded: true, limt: '10kb' }));
app.use(cookieParser());

// Defend against nossql injection
app.use(mongoSanitize());

// Defending against xss
app.use(xss());

// PARAMETER POLLUTION
app.use(
    /* A middleware that prevents parameter pollution. */
    hpp()
);

app.use(compression());

// LIMMIT REQUESTS
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    handler: function (req, res, next) {
        return next(
            new AppError(
                'You sent too many requests. Please wait a while then try again',
                429
            )
        );
    },
    // message: 'Too many requests from the same IP, please try again in an hour.',
    // skipSuccessfulRequests: true,
});

// ROUTES
app.use('/', limiter);
app.use('/v1/user', userRouter);
app.use('/v1/inscription', inscriptionRouter);
app.use('/v1/payment', paymentRouter);
app.use('/v1/course', courseRouter);
app.use('/v1/topics', topicsRouter);
app.use('/v1/program', programRouter);
app.use('/v1/admin', adminRouter);
app.use('/', viewRouter);

// ERROR HANDLER FOR UNHANDLED ROUTES
app.all('*', (req, res, next) => {
    const error = new AppError(
        `Can´t find ${req.originalUrl} on this server`,
        404
    );

    next(error);
});

app.use(globalErrorHandler);

module.exports = app;
