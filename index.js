const express = require('express');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
const serverName = 'Tools Manufacturer';

require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qhytd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const reviewsCollection = client.db('toolsManufacturerDB').collection('reviews');
        const productsCollection = client.db('toolsManufacturerDB').collection('products');
        const myOrdersCollection = client.db('toolsManufacturerDB').collection('myOrders');

        // all reviews
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();

            res.send(reviews);
        });

        // single review
        app.get('/reviews/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewsCollection.findOne(query);

            res.send(review);
        });

        // all products
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();

            res.send(products);
        });

        // single product
        app.get('/products/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);

            res.send(product);
        });

        // add new product
        app.post('/add-product', async (req, res) => {
            const newProductData = req.body;
            const newProduct = await productsCollection.insertOne(newProductData);
            res.send(newProduct);
        });

        // delete a product
        app.delete('/delete-product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deletedProduct = await productsCollection.deleteOne(query);

            res.send(deletedProduct);
        });

        // update a product data
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updateProduct = req?.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateStock = {
                $set: {
                    stock: updateProduct.stock
                }
            };

            const updatedProduct = await productsCollection.updateOne(filter, updateStock, options)
            res.send(updatedProduct);
        });

        // display my orders
        app.get('/my-orders', async (req, res) => {
            const query = { email: email };
            const cursor = myOrdersCollection.find(query);
            const myOrders = await cursor.toArray();

            res.send(myOrders);
        });

        // add to my orders
        app.post('/add-my-orders', async (req, res) => {
            const newlyOrderedProduct = req.body;
            const newOrder = await myOrdersCollection.insertOne(newlyOrderedProduct);

            res.send(newOrder);
        });

        // delete from my orders
        app.delete('/my-orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deletedOrder = await myOrdersCollection.deleteOne(query);

            res.send(deletedOrder);
        });
    }
    finally {

    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running POSDash Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});