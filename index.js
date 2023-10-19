const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()
//middleware
app.use(express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.25fgudl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // create connection dataBase and collection;
        const newBrandDB = client.db('BrandDB').collection('Brand')
        const OrderDB = client.db('BrandDB').collection('Order')
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await newBrandDB.insertOne(product)
            console.log(result)
            res.send(result)
        })
        app.get('/products', async (req, res) => {
            const cursor = await newBrandDB.find().toArray()
            res.send(cursor)
        })

        app.get('/products', async (req, res) => {
            const cursor = await newBrandDB.find().toArray();
            res.send(cursor);
        });


        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const result = await newBrandDB.findOne({ _id: new ObjectId(id) });
            res.send(result);
            console.log(id)
            console.log(result)
        });


        app.get('/products1/:brand', async (req, res) => {
            const brandItem = req.params.brand;
            console.log(brandItem)
            const query = { brandName: brandItem };
            console.log(query)
            const filterProduct = await newBrandDB.find(query).toArray();
            res.send(filterProduct);
            console.log(filterProduct)
        });

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            // Specify the update to set a value for the plot field
            const updateProduct = {
                $set: {
                    name: data.name,
                    brandName: data.brandName,
                    typeOfProduct: data.typeOfProduct,
                    imageUrl: data.imageUrl,
                    price: data.price,
                    rating: data.rating,
                    shortDescription: data.shortDescription
                },
            };
            const result = await newBrandDB.updateOne(
                filter,
                updateProduct,
                options
            );
            res.send(result);
        })


        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await OrderDB.insertOne(order)
            res.send(result)
        })
        app.get('/order', async (req, res) => {
            const cursor = await OrderDB.find().toArray();
            res.send(cursor);
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('this is taz')
})


app.listen(port, () => {
    console.log("the running port is", port)
})