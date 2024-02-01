const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Sample destinations config
const destinationsConfig = {
  strategy: 'custom', // Default routing strategy
  destinations: {
    custom: ['http://destination1.com', 'http://destination2.com'],
    fallback: 'http://fallback.com',
  }
};

// Endpoint to receive events
app.post('/events', (req, res) => {
  const eventData = req.body;

  // Determine routing strategy
  const routingStrategy = req.query.strategy || destinationsConfig.strategy;

  // Determine destinations based on strategy
  const destinations = destinationsConfig.destinations[routingStrategy] || destinationsConfig.destinations.fallback;

  // Send events to destinations
  sendEvents(eventData, destinations);

  res.status(200).send('Event received successfully.');
});

// Function to send events to destinations
function sendEvents(eventData, destinations) {
  destinations.forEach((destination) => {
    // Implement logic to send events (e.g., using HTTP requests)
    // You might want to use a library like axios for making HTTP requests
    // Example: axios.post(destination, eventData);
    console.log(`Sending event to ${destination}`);
  });
}

module.exports = app;
