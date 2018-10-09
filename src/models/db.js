
var config = require('../utils/config');
// Bring Mongoose into the app 
var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

// Build the connection string 
var dbURI = config.mongo.uri;

// Create the database connection 
mongoose.connect(dbURI, { useNewUrlParser: true });

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err);
});


// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
}); 
