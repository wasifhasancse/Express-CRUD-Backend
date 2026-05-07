const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    await client.connect();
    const database = client.db("express-crud");
    const userCollection = database.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:userId", async (req, res) => {
      const userId = req.params.userId;
      const query = {
        _id: new ObjectId(userId),
      };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    app.post("/users", async (req, res) => {
      const userData = req.body;
      const insetUser = await userCollection.insertOne(userData);
      res.send(insetUser);
    });

    app.delete("/users/:userId", async (req, res) => {
      const userId = req.params.userId;
      const query = {
        _id: new ObjectId(userId),
      };
      const deleteUser = await userCollection.deleteOne(query);
      res.send(deleteUser);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // await client.close();
  }
};
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to express server");
});

app.listen(port, () => {
  console.log("Server is running in 8000");
});
