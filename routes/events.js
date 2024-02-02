const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

const destinationsDictionary = [
  {
    name: 'destination1',
    transport: 'http.post',
    url: 'https://example.com/destination1',
  },
  {
    name: 'destination2',
    transport: 'http.post',
    url: 'https://example2.com/destination2',
  },
  {
    name: 'destination3',
    transport: 'console.log'
  },
  {
    name: 'destination4',
    transport: 'console.warn'
  },
]

// Sample destinations config
const destinationsConfig = {
  strategy: 'custom', // Default routing strategy
  destinations: {
    custom: ['http://destination1.com', 'http://destination2.com'],
    fallback: 'http://fallback.com',
  }
};

// Function to send events to destinations
function sendEvents(eventData, destinations) {
  destinations.forEach((destination) => {
    //TODO Implement logic to send events (e.g., using HTTP requests)
    console.log(`Sending event to ${destination}`);
  });
}

// Protected route
  router.get('/', verifyToken, (req, res) => {
  // Determine routing strategy
  const routingStrategy = req.query.strategy || destinationsConfig.strategy;

  // Determine destinations based on strategy
  const destinations = destinationsConfig.destinations[routingStrategy] || destinationsConfig.destinations.fallback;

   // Send events to destinations
  sendEvents(eventData, destinations);

  res.status(200).json('Event received successfully.');
});

module.exports = router;