const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send('Hello Reader!')
  })
  
  app.listen(port, () => {
    console.log(`listening at ${port}`)
  })