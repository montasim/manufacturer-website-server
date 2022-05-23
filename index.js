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

        const usersCollection = client.db('toolsManufacturerDB').collection('users');
        const adminsCollection = client.db('toolsManufacturerDB').collection('admins');
        const reviewsCollection = client.db('toolsManufacturerDB').collection('reviews');
        const categoriesCollection = client.db('toolsManufacturerDB').collection('categories');
        const productsCollection = client.db('toolsManufacturerDB').collection('products');
        const myOrdersCollection = client.db('toolsManufacturerDB').collection('myOrders');
        const myCartCollection = client.db('toolsManufacturerDB').collection('cart');
        const blogsCollection = client.db('toolsManufacturerDB').collection('blogs');

        // provide access token when user logins
        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jsonwebtoken.sign(user, process.env.JWT_ACCESS_TOKEN, {
                expiresIn: '1d'
            });
            res.send(accessToken);
        })

        // all users
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();

            res.send(users);
        });

        // single user
        app.get('/users/:email', async (req, res) => {
            const email = req?.params?.email;
            const query = { email: ObjectId(email) };
            const user = await usersCollection.findOne(query);

            res.send(user);
        });

        // add new user
        app.post('/add-user', async (req, res) => {
            const newUserData = req.body;
            const newUser = await usersCollection.insertOne(newUserData);
            res.send(newUser);
        });

        // delete a user
        app.delete('/delete-user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: ObjectId(email) };
            const deletedUser = await usersCollection.deleteOne(query);

            res.send(deletedUser);
        });

        // all admins
        app.get('/admins', async (req, res) => {
            const query = {};
            const cursor = adminsCollection.find(query);
            const admins = await cursor.toArray();

            res.send(admins);
        });

        // single admin
        app.get('/admins/:email', async (req, res) => {
            const email = req?.params?.email;
            const query = { email: ObjectId(email) };
            const admin = await adminsCollection.findOne(query);

            res.send(admin);
        });

        // add new user
        app.post('/add-admin', async (req, res) => {
            const newAdminData = req.body;
            const newAdmin = await adminsCollection.insertOne(newAdminData);

            res.send(newAdmin);
        });

        // delete a admin
        app.delete('/delete-admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: ObjectId(email) };
            const deletedAdmin = await adminsCollection.deleteOne(query);

            res.send(deletedAdmin);
        });

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

        // all categories
        app.get('/categories', async (req, res) => {
            const query = {};
            const cursor = categoriesCollection.find(query);
            const categories = await cursor.toArray();

            res.send(categories);
        });

        // single category
        app.get('/categories/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const category = await categoriesCollection.findOne(query);

            res.send(category);
        });

        // add new category
        app.post('/add-category', async (req, res) => {
            const newCategoryData = req.body;
            const newCategory = await categoriesCollection.insertOne(newCategoryData);
            res.send(newCategory);
        });

        // delete a category
        app.delete('/delete-category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deletedCategory = await categoriesCollection.deleteOne(query);

            res.send(deletedCategory);
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
        app.get('/my-orders/:email', async (req, res) => {
            const email = { email: email };
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

        // display my cart
        app.get('/cart/:email', async (req, res) => {
            const query = { email: email };
            const cursor = myCartCollection.find(query);
            const cart = await cursor.toArray();

            res.send(cart);
        });

        // add to my cart
        app.post('/add-my-cart', async (req, res) => {
            const newCartProduct = req.body;
            const newCart = await myCartCollection.insertOne(newCartProduct);

            res.send(newCart);
        });

        // delete from my cart
        app.delete('/my-cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deletedCart = await myCartCollection.deleteOne(query);

            res.send(deletedCart);
        });

        // all blogs data
        app.get('/blogs', async (req, res) => {
            const query = {};
            const cursor = blogsCollection.find(query);
            const blogs = await cursor.toArray();

            res.send(blogs);
        });

        // single blog data
        app.get('/blogs/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const blog = await blogsCollection.findOne(query);

            res.send(blog);
        });

        // add new blog
        app.post('/add-blog', async (req, res) => {
            const newBlogData = req.body;
            const newBlog = await blogsCollection.insertOne(newBlogData);
            res.send(newBlog);
        });

        // delete a blog
        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deletedBlog = await blogsCollection.deleteOne(query);

            res.send(deletedBlog);
        });
    }
    finally {

    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(`
        ${serverName} server is running on port ${port}
        
    `);
});

app.listen(port, () => {
    console.log(`${serverName} server is running on port ${port}`);
});