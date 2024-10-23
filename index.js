const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

const port = process.env.PORT || 5000
//middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bter72s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(`Connecting to MongoDB as user: ${process.env.DB_USER}`);
console.log(`Using connection URI: ${uri}`);

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
    // await client.connect();


    const agentsCollection = client.db("velki").collection("agents");
    const SubAdminsCollection = client.db("velki").collection("sub-admins");
    const usersCollection = client.db("velki").collection("users");

    app.get('/users', async (req, res) => {
        const result = await usersCollection.find().toArray();
        // console.log(result)
        res.send(result)
    })


    app.post('/users', async (req, res) => {
        const user = req.body;
        // console.log(user);
        const query = { email: user.email }
        const existingUser = await usersCollection.findOne(query)
        if (existingUser) {
            return res.send({ message: 'user already exist', existingUser })
        }
        const result = await usersCollection.insertOne(user);
        res.send(result);
    })


    
app.get('/agents',async(req,res)=>{
    const result =  await agentsCollection.find().toArray();
    res.send(result)
})


// PUT route to update agent by ID
app.put('/agents/:id', async (req, res) => {
  const id = req.params.id;
  const updatedAgent = req.body;

  // Remove _id from updatedAgent to avoid trying to update it
  delete updatedAgent._id;

  try {
    const query = { id: parseInt(id) };  // Ensure ID is parsed as an integer
    const updateDoc = {
      $set: updatedAgent,  // $set ensures that only the fields in updatedAgent are updated
    };

    const result = await agentsCollection.updateOne(query, updateDoc);

    if (result.matchedCount === 0) {
      res.status(404).send({ message: 'Agent not found' });
    } else {
      res.send(result);
    }
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).send({ message: 'Failed to update agent' });
  }
});



app.get('/sub-admins',async(req,res)=>{
    const result =  await SubAdminsCollection.find().toArray();
    res.send(result)
})

 //server url for the added toys in the client site by user
 app.post("/add-sub-admins", async (req, res) => {
  const body = req.body;
  const result = await SubAdminsCollection.insertOne(body);
  res.send(result);
  console.log(result);

});

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send("bossss is running")
})

app.listen(port,()=>{
    console.log(`velki agents master are sitting on port ${port}`)
})


















//chat gpt


// const express = require('express');
// const cors = require('cors');
// const { MongoClient, ServerApiVersion } = require('mongodb');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bter72s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// // Connect to MongoDB
// async function run() {
//   try {
//     await client.connect();
//     console.log("Connected to MongoDB!");

//     const agentsCollection = client.db("velki").collection("agents");
//     const SubAdminsCollection = client.db("velki").collection("sub-admins");
//     const usersCollection = client.db("velki").collection("users");

//     app.get('/api/users', async (req, res) => {
//       const result = await usersCollection.find().toArray();
//       res.send(result);
//     });

//     app.post('/api/users', async (req, res) => {
//       const user = req.body;
//       const existingUser = await usersCollection.findOne({ email: user.email });
//       if (existingUser) {
//         return res.send({ message: 'User already exists', existingUser });
//       }
//       const result = await usersCollection.insertOne(user);
//       res.send(result);
//     });

//     app.get('/api/agents', async (req, res) => {
//       const result = await agentsCollection.find().toArray();
//       res.send(result);
//     });

//     // PUT route to update agent by ID
//     app.put('/api/agents/:id', async (req, res) => {
//       const id = req.params.id;
//       const updatedAgent = req.body;
//       delete updatedAgent._id;

//       const query = { id: parseInt(id) };
//       const updateDoc = { $set: updatedAgent };
//       const result = await agentsCollection.updateOne(query, updateDoc);

//       if (result.matchedCount === 0) {
//         res.status(404).send({ message: 'Agent not found' });
//       } else {
//         res.send(result);
//       }
//     });

//     app.get('/api/sub-admins', async (req, res) => {
//       const result = await SubAdminsCollection.find().toArray();
//       res.send(result);
//     });

//     app.post("/api/add-sub-admins", async (req, res) => {
//       const body = req.body;
//       const result = await SubAdminsCollection.insertOne(body);
//       res.send(result);
//     });

//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//   }
// }

// run().catch(console.dir);

// // Basic health check
// app.get('/', (req, res) => {
//   res.send("API is running");
// });

// // Vercel export
// module.exports = app;
