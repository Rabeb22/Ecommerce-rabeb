const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');
const path = require('path');

// middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware.js');

const productRoutes = require('./routes/productRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const authRoutes = require('./routes/authRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
// const configRoutes = require('./routes/configRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
// const auths = require('./routes/auths');
const setupPassport = require('./config/passportSetup.js');
// require('./config/passport.js');

dotenv.config();
const app = express();

// use morgan in development mode
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// connect to the mongoDB database
connectDB();

app.use(express.json()); // middleware to use req.body
// app.use(cors()); // to avoid CORS errors
app.use(compression()); // to use gzip

// use cookie sessions
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    keys: [process.env.COOKIE_SESSION_KEY],
  })
);

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  })
);

// initialise passport middleware to use sessions, and flash messages
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// setup passport
setupPassport();

// configure all the routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
// app.use('/api/auth', auths);
app.use('/api/orders', orderRoutes);
// app.use('/api/config', configRoutes);
app.use('/api/upload', uploadRoutes);

const dirname = path.resolve();
app.use('/uploads', express.static(path.join(dirname, '/uploads')));

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// middleware to act as fallback for all 404 errors
app.use(notFound);

// configure a custome error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) =>
  err ? console.log(err) : console.log(`Server is running on port ${PORT}`)
);
