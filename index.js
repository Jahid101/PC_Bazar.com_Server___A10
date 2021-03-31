const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const PORT = process.env.PORT || 7777;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome')
})


app.listen(PORT)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9v095.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db("pcbazar").collection("products");
  const ordersCollection = client.db("pcbazar").collection("orders");


  app.get('/products', (req, res) => {
    productCollection.find()
      .toArray((err, products) => {
        res.send(products);
      })
  })


  app.get('/products/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    productCollection.find({ _id: id })
      .toArray((err, products) => {
        res.send(products[0]);
      })
  })


  app.get('/orderPreview', (req, res) => {
    ordersCollection.find({ email: req.query.email })
      .toArray((err, orders) => {
        res.send(orders);
      })
  })


  app.post('/buyProduct', (req, res) => {
    const newProduct = req.body;
    ordersCollection.insertOne(newProduct)
      .then(result => {
        res.send(result.insertedCount > 0);
      })

  })


  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })


  app.delete('/deleteProduct/:id', (req, res) => {
    const id = ObjectID(req.params.id)
    productCollection.deleteOne({ _id: id })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })


});
