const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const eventsRoute = require('./routes/events');
const logMiddleware = require('./middleware/logMiddleware')
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(logMiddleware);
app.use('/auth', authRoutes);
app.use('/events', eventsRoute);

module.exports = app;
