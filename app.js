const express = require('express');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const eventsRoute = require('./routes/events');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/events', eventsRoute);

// Sample destinations config
const destinationsConfig = {
  strategy: 'custom', // Default routing strategy
  destinations: {
    custom: ['http://destination1.com', 'http://destination2.com'],
    fallback: 'http://fallback.com',
  }
};

module.exports = app;
