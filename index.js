const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
app.use(cors());
const port = process.env.PORT || 5001;
require("dotenv").config();
app.use(express.json());

const uri = "mongodb+srv://nakibDb:JD6QgYUqQA2tPXxy@cluster0.kfvltem.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});



async function run() {
  try {
    const serviceCollection = client.db("photoUser").collection("services");
    const reviewCollection = client.db("photoUser").collection("reviews");
    await client.connect();
    // create jwt token
   

    // find the limit services using get methods
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.sort({ _id: -1 }).limit(3).toArray();
      res.send(services);
    });
    // find the all services using get methods
    app.get("/allServices", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    // find single user information
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.findOne(query);
      res.send(result);
    });
    // post for add allServices
    app.post("/addService", async (req, res) => {
      const review = req.body;
      const result = await serviceCollection.insertOne(review);
      res.send(result);
    });
    // post for all reviews
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });
    // get specific review services
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.serviceName) {
        query = {
          serviceName: req.query.serviceName,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.sort({ date: 1 }).toArray();
      res.send(reviews);
    });
    //delete a review
    app.delete("/myReviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
    // update a single user information from here

    app.put("/myReviews/:id", async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          serviceName: updateUser.serviceName,
          date: updateUser.date,
          message: updateUser.message,
        },
      };
      const result = await reviewCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    // find user specific reviews
    app.get("/myReviews",  async (req, res) => {
      const decoded = req.decoded;
      if (decoded.email !== req.query.email) {
        res.status(403).send({ message: "forbidden" });
      }
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Photo Service server running");
});

app.listen(port, () => {
  console.log(`PhotoService Server running ${port}`);
});
module.exports = app;

