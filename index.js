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
        // Send a ping to confirm a successful connection
        const newBrandDB = client.db('BrandDB').collection('Brand')
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


        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) };
            const result = await newBrandDB.findOne(query);
            res.send(result)
            console.log(query)
        })


        app.get('/products/:brand', async (req, res) => {
            const brandItem = req.params.brand
            const query = { brandName: brandItem }
            const filterProduct = await newBrandDB.find(query).toArray();
            res.send(filterProduct);
           
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