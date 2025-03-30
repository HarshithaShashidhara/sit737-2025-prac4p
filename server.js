// Import required modules
const express = require('express'); // Express framework for handling HTTP requests
const winston = require('winston'); // Winston for logging
const app = express(); // Create an Express application
const port = 3050; // Define the port on which the server will run

// Winston Logger Configuration
const logger = winston.createLogger({
  level: 'info', // Set logging level to 'info'
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamps to logs
    winston.format.json() // Log messages in JSON format
  ),
  defaultMeta: { service: 'calculator-microservice' }, // Metadata for log entries
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), // Log to console in simple format
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Log errors to error.log
    new winston.transports.File({ filename: 'logs/combined.log' }), // Log all messages to combined.log
  ],
});

// Middleware to validate num1 and num2 from query parameters
const validateNumbers = (req, res, next) => {
  const num1 = parseFloat(req.query.num1); // Parse num1 from query string
  const num2 = parseFloat(req.query.num2); // Parse num2 from query string

  // Check if both numbers are valid
  if (isNaN(num1) || isNaN(num2)) {
    const message = 'Both num1 and num2 must be valid numbers'; // Error message
    logger.error(message); // Log error
    return res.status(400).json({ error: message }); // Return error response
  }

  req.num1 = num1; // Attach validated num1 to request object
  req.num2 = num2; // Attach validated num2 to request object
  next(); // Proceed to the next middleware or route handler
};

// Function to perform arithmetic operations
const performOperation = (req, res, operation) => {
  try {
    let result;

    // Perform the requested arithmetic operation
    switch (operation) {
      case 'add':
        result = req.num1 + req.num2;
        break;
      case 'subtract':
        result = req.num1 - req.num2;
        break;
      case 'multiply':
        result = req.num1 * req.num2;
        break;
      case 'divide':
        if (req.num2 === 0) { // Prevent division by zero
          const message = 'Division by zero is not allowed';
          logger.error(message);
          return res.status(400).json({ error: message });
        }
        result = req.num1 / req.num2;
        break;
      default:
        throw new Error('Invalid operation'); // Handle unknown operations
    }

    // Log successful operation
    logger.info(`${operation.toUpperCase()}: ${req.num1} ${operation} ${req.num2} = ${result}`);

    // Send response with the result
    res.json({ operation, result });
  } catch (err) {
    // Log error if operation fails
    logger.error(`${operation.toUpperCase()} Error: ${err.message}`);
    res.status(500).json({ error: `Error during ${operation}` });
  }
};

// Route handlers for different arithmetic operations
app.get('/add', validateNumbers, (req, res) => performOperation(req, res, 'add'));
app.get('/subtract', validateNumbers, (req, res) => performOperation(req, res, 'subtract'));
app.get('/multiply', validateNumbers, (req, res) => performOperation(req, res, 'multiply'));
app.get('/divide', validateNumbers, (req, res) => performOperation(req, res, 'divide'));

// Health check endpoint to check if the microservice is running
app.get('/health', (req, res) => {
  res.json({ status: 'Calculator microservice is running' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`); // Log unexpected errors
  res.status(500).json({ error: 'An unexpected error occurred.' }); // Return generic error response
});

// Start the server and listen on the defined port
app.listen(port, () => {
  logger.info(`Calculator microservice running at http://localhost:${port}`);
});
