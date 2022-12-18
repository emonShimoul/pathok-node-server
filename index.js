const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(fileUpload());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pabg0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const database = client.db('pathok');
    const booksCollection = database.collection('books');
    const usersCollection = database.collection('users');

    app.post('/books', async (req, res) => {
      // console.log('body', req.body);
      const bookname = req.body.bookname;
      const writername = req.body.writername;
      const category = req.body.category;
      const description = req.body.description;
      const price = req.body.price;
      const rating = req.body.rating;
      // console.log('files', req.files);
      const pic = req.files.image;
      const picData = pic.data;
      const encodedPic = picData.toString('base64');
      const imgBuffer = Buffer.from(encodedPic, 'base64');
      const book = {
        bookname,
        writername,
        category,
        description,
        price,
        rating,
        image: imgBuffer
      }
      const result = await booksCollection.insertOne(book);
      res.json(result)
    });

    app.get('/books', async (req, res) => {
      const cursor = booksCollection.find({});
      const books = await cursor.toArray();
      res.json(books);
    })

    app.get('/books/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const book = await booksCollection.findOne(query);
      res.json(book);
    })

    // DELETE API for Books
    app.delete('/books/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await booksCollection.deleteOne(query);
      res.json(result);
    })

    // save user to the database by registration
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // save user to the database by using google account registration
    app.put('/users', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true }; // this option instructs the method to create a document if no documents match the filter
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
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