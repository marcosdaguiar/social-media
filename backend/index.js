//Import required modules
const connectDB = require('./database/connection');
const express = require('express');
const cors = require('cors');

// db connection
connectDB()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));
//create node server
const app = express();
const PORT = 3900;


//cors config
app.use(cors());

// conert body data to  objects js
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// load config routes


// Test route
app.get('/test', (req, res) => {
  return res.status(200).json({
    message: 'Test route is working',
  }); 
});

// listen to http requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});