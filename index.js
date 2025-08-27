const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config()
const { ObjectId } = require("mongodb");

const port = process.env.PORT || 5000;
//middleware
app.use(cors({
  origin: [
    "https://www.valkilive123.com",
    "https://www.velkiallagent123.pro",
    "https://www.valkiiallmaster.live",
    "https://www.winpdu.live",
    "https://www.velkiallagent123.live", // your deployed frontend domain
    "http://localhost:5173" // keep localhost for dev
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bter72s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(`Connecting to MongoDB as user: ${process.env.DB_USER}`);
console.log(`Using connection URI: ${uri}`);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const agentsCollection = client.db("velki").collection("agents");
    const SubAdminsCollection = client.db("velki").collection("sub-admins");
    const usersCollection = client.db("velki").collection("users");
    const SiteAdminsCollection = client.db("velki").collection("site-admins");
    const MasterAgentsCollection = client.db("velki").collection("master-agents");
    const SuperAgentsCollection = client.db("velki").collection("super-agents");
    const Velkix24_MasterAgentsCollection = client.db("velki").collection("velkix24-master-agents");
    const whatsappLinksCollection = client.db("velki").collection("whatsapp-links");
    const superAgentswhatsappLinksCollection = client.db("velki").collection("super-agents-whatsapp-links");

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      // console.log(result)
      res.send(result);
    });
    app.get("/site-admins", async (req, res) => {
      const result = await SiteAdminsCollection.find().toArray();
      // console.log(result)
      res.send(result);
    });

    app.get("/master-agents", async (req, res) => {
      const result = await MasterAgentsCollection.find().toArray();
      // console.log(result)
      res.send(result)
  })

  
  app.get("/super-agents", async (req, res) => {
    const result = await SuperAgentsCollection.find().toArray();
    // console.log(result)
    res.send(result)
})

    app.get('/velkix24-master-agents', async (req, res) => {
      const result = await Velkix24_MasterAgentsCollection.find().toArray();
      // console.log(result)
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      // console.log(user);
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exist", existingUser });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    
app.get('/agents',async(req,res)=>{
    const result =  await agentsCollection.find().toArray();
    res.send(result)
})








app.put("/master-agents/:_id", async (req, res) => {
  const _id = new ObjectId(req.params._id); // Convert string ID to ObjectId
  const updatedAgent = req.body; // Get the updated data from the request body

  try {
    // Update the master agent in the collection
    const result = await MasterAgentsCollection.updateOne(
      { _id, type: "master-agent" }, // Match by `_id` and ensure it's a master agent
      { $set: updatedAgent }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Master agent not found" });
    }

    res.send({
      message: "Master agent updated successfully",
      result,
    });
  } catch (error) {
    console.error("Error updating master agent:", error);
    res.status(500).send({
      message: "Failed to update master agent",
      error: error.message,
    });
  }
});




// // Get WhatsApp links
// app.get("/whatsapp-links", async (req, res) => {
//   const document = await whatsappLinksCollection.findOne({
//     type: "whatsapp-links",
//   });
//   res.send(document ? document.links : []);
// });

app.post("/api/whatsapp-links", async (req, res) => {
  const { links } = req.body;
  try {
    // Save links in your desired collection or logic
    console.log("Received links:", links);
    res.status(200).send({ message: "WhatsApp links saved successfully!" });
  } catch (error) {
    console.error("Error saving WhatsApp links:", error);
    res.status(500).send({ message: "Failed to save WhatsApp links." });
  }
});



app.post("/api/super-agents-whatsapp-links", async (req, res) => {
  const { links } = req.body;
  try {
    // Save links in your desired collection or logic
    console.log("Received links:", links);
    res.status(200).send({ message: "WhatsApp links saved successfully!" });
  } catch (error) {
    console.error("Error saving WhatsApp links:", error);
    res.status(500).send({ message: "Failed to save WhatsApp links." });
  }
});








    // PUT route to update agent by ID
    app.put("/site-admins/:id", async (req, res) => {
      const id = req.params.id;
      const updatedSiteAdmin = req.body;

      // Remove _id from updatedSiteAdmin to avoid trying to update it
      delete updatedSiteAdmin._id;

      try {
        const query = { id: parseInt(id) }; // Ensure ID is parsed as an integer
        const updateDoc = {
          $set: updatedSiteAdmin, // $set ensures that only the fields in updatedSiteAdmin are updated
        };

        const result = await SiteAdminsCollection.updateOne(query, updateDoc);

        if (result.matchedCount === 0) {
          res.status(404).send({ message: "site admin not found" });
        } else {
          res.send(result);
        }
      } catch (error) {
        console.error("Error updating site admin:", error);
        res.status(500).send({ message: "Failed to update site admin" });
      }
    });

    app.get("/sub-admins", async (req, res) => {
      const result = await SubAdminsCollection.find().toArray();
      res.send(result);
    });

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


