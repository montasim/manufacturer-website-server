const express = require('express');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');

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

        // testimonials
        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();

            res.send(reviews);
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