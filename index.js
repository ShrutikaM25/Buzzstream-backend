const express = require('express')
const cors =require('cors')
const app = express()
require("dotenv").config();
const {MongoClient, ServerApiVersion} = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());


const MongoUser = process.env.DB_USER;
const MongoPass = process.env.DB_PASS;

const uri = `mongodb+srv://${MongoUser}:${MongoPass}@cluster0.dv8tfk9.mongodb.net/`
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1}); 

async function run() {
    try{
        await client.connect();
        const postCollection = client.db('database').collection('posts')
        const userCollection = client.db('database').collection('users')

        app.get('/post', async(req, res)=>{
            const post = (await postCollection.find().toArray()).reverse();
            res.send(post);
        })

        app.get('/user', async(req, res)=>{
            const user = await userCollection.find().toArray();
            res.send(user);
        })

        app.get('/loggedInUser', async(req, res) => {
            const email = req.query.email;
            const user = await userCollection.find({email:email}).toArray();
            res.send(user);
        })

        app.get('/userPost', async(req, res) => {
            const email = req.query.email;
            const post = (await postCollection.find({email:email}).toArray()).reverse();
            res.send(post);
        })

        app.post('/post', async(req, res) => {
            const post = req.body;
            const result = await postCollection.insertOne(post);
            res.send(result);
        })

        app.post('/register', async(req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.patch('/userUpdates/:email' , async(req, res) =>{
            const filter = req.params;
            const profile = req.body;
            const options = {upsert: true};
            const updateDoc = {$set:profile};
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })
        app.get('/', (req,res) =>{
            res.send('Welcome User!')
        })
        app.listen(port, () =>{
            console.log(`Twitter listening on port ${port}`)
        })


    }catch (error) {
        console.log(error);
    }
} run().catch(console.dir)

module.exports = app;