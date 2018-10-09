'use strict';
require('dotenv').config();

module.exports = {
  settings:{
    baseUrl: process.env.BASE_URL,
    port: process.env.PORT
  },
  mongo:{
    uri: process.env.MONGODB_URI
  }
}