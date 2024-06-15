const express = require('express');
const connectDB = require('./config/database'); // Adjust path as needed
const productRoutes = require('./routes/productRoutes'); // Adjust path as needed
const dotenv = require('dotenv');


const app = express();
const PORT = process.env.PORT || 9000;


dotenv.config();

// Connect to MongoDB
connectDB()
  .then(() => {
    // Middleware
    app.use(express.json());

    // Routes
    app.use('/api/v1', productRoutes);

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  });
