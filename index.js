const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pabg0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    // console.log('database connected successfully');
    const database = client.db('pathok');
    const booksCollection = database.collection('books');

    app.post('/books', async (req, res) => {
      const books = req.body;
      const result = await booksCollection.insertOne(books);
      // console.log(books);
      res.json(result);
    });

    app.get('/books', async (req, res) => {
      const cursor = booksCollection.find();
      const books = await cursor.toArray();
      res.json(books);
    })
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello Reader!')
});

app.listen(port, () => {
  console.log(`listening at ${port}`)
});