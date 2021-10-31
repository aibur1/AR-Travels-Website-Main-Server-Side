const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsmmh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('travels');
        const offerCollection = database.collection('offers');

        // POST API
        app.post('/offers', async (req, res) => {
            const offer = req.body;
            console.log('hit the post api', offer);
            const result = await offerCollection.insertOne(offer);
            console.log(result)
            res.json(result)

        });

        //GET Offers API
        app.get('/offers', async (req, res) => {
            const cursor = offerCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        });

        //GET Single offer
        app.get('/offers/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific offer', id);
            const query = { _id: ObjectId(id) };
            const offer = await offerCollection.findOne(query);
            res.json(offer);
        });

        // DELETE API
        app.delete('/offers/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await offerCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('AR Server is running');
});

app.listen(port, () => {
    console.log('Running port at', port);
});