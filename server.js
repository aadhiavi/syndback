const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
dotenv.config();
require('./config/passport');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const subscribeRoutes = require('./routes/subscribe');
const dataRoutes = require('./routes/dataRoutes');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log(error));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', contactRoutes);
app.use('/api/auth', subscribeRoutes);
app.use('/api/auth', dataRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

