const express = require('express');
const cors = require('cors');
const jsonwebtoken = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;
const serverName = process.env.DB_SERVER_NAME;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fkzlo.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = _ => {
    try {

    }
    finally {

    }
};

app.get('/', (req, res) => {
    res.send(`Welcome to ${serverName} server`);
});

app.get('/index', (req, res) => {
    res.send(`Welcome to ${serverName} server`);
});

app.get('/home', (req, res) => {
    res.send(`Welcome to ${serverName} server`);
});

app.get('*', (req, res) => {
    res.send(`Try with a valid server URL`);
});

app.listen(port, () => {
    console.log(`${serverName} is running on port ${port}`);
});

