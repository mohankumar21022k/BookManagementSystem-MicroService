const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

//protected connection string
const MONGODB_URI = `mongodb+srv://${process.env.MongoUser}:${process.env.MongoPass}@library.pblks.mongodb.net/${process.env.MongoDB}`;

//registering routes
const userRoute = require('../User/routes/users');

//instance of express
const app = express();

//parsing the request body to json 
app.use(bodyParser.json());

//routes using middleware
app.use(userRoute);

//unknown url access handling middleware
app.use((req, res, next) => { res.status(404).json({ message: '404! Page Not Found' }) });

//error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message });
});

//databaseConnection-MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(8000);
    console.log('Connected to your database at MongoDB')
  })
  .catch(err => console.log(err));