const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MongoDB_USER}:${process.env.MongoDB_PASS}@cluster0.cricab9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const spotCollection = client.db("TraveloDB").collection('AllSpots')



    app.get('/', (req, res)=>{
      res.send("Travelo server is running...")
    })

    // Add tourist spot in database
    app.post('/allTouristsSpot', async(req, res) =>{
        const newSpot = req.body;
        console.log(newSpot);
        const result = await spotCollection.insertOne(newSpot);
        res.send(result)
    })

    // Get all tourists spot data from database
    app.get('/allTouristsSpot', async(req, res)=>{
        const cursor = spotCollection.find();
        const result = await cursor.toArray();
        res.send(result)
      }) 

    // Get single spot details data from database
    app.get('/allTouristsSpot/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await spotCollection.findOne(query);
        res.send(result)
      }) 

    // Get my list data from database
    app.get('/allTouristsSpot/email/:email', async(req, res)=>{
        const id = req.params.email
        const query = {email : id}
        const result = await spotCollection.find(query).toArray();
        res.send(result)
      }) 

    // Delete item from my list
    app.delete('/allTouristsSpot/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await spotCollection.deleteOne(query);
        res.send(result)
      })

    // Update spot data
    app.put('/allTouristsSpot/:id', async(req, res)=>{
        const id = req.params.id;
        const filter = {_id : new ObjectId(id)}
        const options = { upsert: true };
        const updateSpot = req.body;
        const coffee = {
            $set : {
              countryName : updateSpot.countryName,
              spotName : updateSpot.spotName,
              image : updateSpot.image,
              location : updateSpot.location,
              description : updateSpot.description,
              average : updateSpot.average,
              seasonality : updateSpot.seasonality,
              travelTime : updateSpot.travelTime,
              totalVisitor : updateSpot.totalVisitor
            }
        }
        const result = await spotCollection.updateOne(filter, coffee, options);
        res.send(result)
      })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, ()=>{
    console.log("Travelo server is running on port : ", port);
})