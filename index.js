/** @format */

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());
var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.v85be.mongodb.net:27017,cluster0-shard-00-01.v85be.mongodb.net:27017,cluster0-shard-00-02.v85be.mongodb.net:27017/?ssl=true&replicaSet=atlas-e24feo-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1
});

// // jwt////
const jwt = require("jsonwebtoken");
// // jwt////




// /////////monney transper er jonno/////////////
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// /////////monney transper er jonno/////////////





function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access" });
  }
  const token = authHeader.split(" ")[1];
  console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(403).send({ message: "Forbidden access" });
    }
    console.log("decoded", decoded);
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    // await client.connect();
    const productsCollection = client
      .db("Ecommerce")
      .collection("productsCollection");
    const cartCollection = client.db("Ecommerce").collection("cartCollection");
    const orderCollection = client
      .db("Ecommerce")
      .collection("orderCollection");
    const userCollection = client.db("Ecommerce").collection("userCollection");
    const paymentCollection = client.db("Ecommerce").collection("PaymentCollection");
    const profileColllection = client
      .db("Ecommerce")
      .collection("profileCollection");

    // getallproducts

    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    // getallproducts

    // post card//
    app.post("/cart", async (req, res) => {
      const cart = req.body;
      console.log(req.body);
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });
    // post card//

    // get cart
    app.get("/cart", async (req, res) => {
      const query = {};
      const cursor = cartCollection.find(query);
      const cart = await cursor.toArray();
      res.send(cart);
    
    });


//get cat by email


app.get("/carts",  async (req, res) => {
  const email = req.query.email;
  console.log(email)
  const query = { email: email };
  const cursor = cartCollection.find(query);
  const cart = await cursor.toArray();
  res.send(cart);

})


    // delete cart
    app.delete("/deletecart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    
    });
    ////////
   

    ///////////////////single data with id///////////////

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    // post order//
    app.post("/order", async (req, res) => {
      const cart = req.body;
      console.log(req.body);
      const result = await orderCollection.insertOne(cart);
      res.send(result);
    });
    // post order//

    ////////delete all carts////////
    app.delete("/deleteallcarts", async (req, res) => {
      const query = {};
      const result = await cartCollection.deleteMany(query);
      res.send(result);
    });
    ////////delete all carts////////

 


    //////////////////review post ////////////////////

    // app.post("/reviews", async (req, res) => {
    //   const newproduct = req.body;

    //   const result = await reviewCollection.insertOne(newproduct);
    //   res.send(result);
    // });

    ////profile post
    app.post("/profile", async (req, res) => {
      const newproduct = req.body;
      console.log("body",newproduct)
      const result = await profileColllection.insertOne(newproduct);
      res.send(result);
    });

    app.get("/profile", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      const cursor = profileColllection.find(query);
      const profileData = await cursor.toArray();
      res.send(profileData);
    });

   
   


    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const services = await cursor.toArray();
      res.send(services); 

    
    });



    app.get("/order",  async (req, res) => {
      const email = req.query.email;
      console.log(email)
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);

  })



// delete myorders





    app.post("/productsCollection", async (req, res) => {
      const order = req.body;
      const result = await serviceCollection.insertOne(order);
      res.send(result);
    });




    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });




    app.delete("/deleteprofile/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });




    

    app.delete("/deleteproduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });




    // app.get('/reviews', async (req, res) => {
    //   const query = {};
    //   const cursor = reviewCollection.find(query)
    //   const services = await cursor.toArray();
    //   res.send(services);
    // });






    // //////////////////////varify admin//////////////////
    const verifyAdmin = async (req, res, next) => {
      const requester = req.decoded.email;
      console.log(requester);
      const requesterAccount = await userCollection.findOne({
        email: requester
      });
      if (requesterAccount.role === "admin") {
        next();
      } else {
        res.status(403).send({ message: "forbidden" });
      }
    };
    //  ////////////////////varify admin////////////////////

    //  verifyJWT,   eita stripe er inter nal
    /////////////////////////card paument kora////////////////////////////////
    app.post("/create-payment-intent", async (req, res) => {
      const service = req.body;

      const price = service.price;
      const amount = parseInt(price) * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"]
      });
      res.send({ clientSecret: paymentIntent.client_secret });
    });
    /////////////////////////card paument kora////////////////////////////////

    verifyJWT,
      ///////////////////payment korar somoy alada pruduct er payment kora//////////
      app.patch("/pay/:id", async (req, res) => {
        const id = req.params.id;

        const payment = req.body;
        console.log(payment);
        const filter = { _id: ObjectId(id) };
        const updatedDoc = {
          $set: {
            paid: true,
            pending: true,
            transactionId: payment.transactionId
          }
        };

        const result = await paymentCollection.insertOne(payment);
        const updatedBooking = await orderCollection.updateOne(
          filter,
          updatedDoc
        );
        res.send(updatedBooking);
      });
    /////////////////payment korar somoy alada pruduct er payment kora///////////

    /////////update order when shipment
    app.put("/order/update/:id", async (req, res) => {
      const id = req.params.id;
      const updateOrder = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: updateOrder
      };
      const result = await orderCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });












// ////////////////////////////
    
app.post("/added", async (req, res) => {
  const order = req.body;
  
  const result = await productsCollection.insertOne(order);
  res.send(result);
});

// //////////////////////////




// update schema


app.put("/mini/update/:id/:_id", async (req, res) => {
  const id = req.params.id;
  const _id=req.params._id;
console.log(id,_id)
const result= await orderCollection.update (
  { "_id": ObjectId(id) },
  {
    $pull: { "products": { "_id": _id } }
  }
);
console.log("result",result)
res.send(result);

});





































 /////////////////////single data with id///////////////
    app.get("/pay/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      const product = await orderCollection.findOne(query);
      res.send(product);
    });
    /////////////////////single data with id///////////////

 








    






 ;
    







    /////////////////////////////////user er data load korar niom//////////////////////
    app.get("/user", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });
    /////////////////////////////////user er data load korar niom//////////////////////

    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // ///////////////////////////////////[requ1ired admin] object er moddo role==admin hole true return korbe ebong jodi true return kore tahole ami koekta router sorto die dekhabo //////////////////////////////////////////////
    app.get("/admin/:email", async (req, res) => {
      const email = req.params.email;
      const user = await userCollection.findOne({ email: email });
      const isAdmin = user?.role === "admin";

      res.send({ admin: isAdmin });
    });
    // ///////////////////////////////////[required admin] object er moddo role==admin hole true return korbe ebong jodi true return kore tahole ami koekta router sorto die dekhabo //////////////////////////////////////////////



 
  ////////////////////////////////for admin nije chara keu dekhte parbena////////////////////////
  app.put('/user/admin/:email', verifyJWT, verifyAdmin, async (req, res) => {
    const email = req.params.email;
    console.log(verifyJWT)
    const filter = { email: email };
    const options = { upsert: true };
    const updateDoc = {
      $set: { role: 'admin' },
    };
    const result = await userCollection.updateOne(filter, updateDoc,options);
    res.send(result);
  })
  ////////////////////////////////for admin nije chara keu dekhte parbena////////////////////////


  














    ////////////////////login korar somoy user je token create kore oita ba useToken er jonno/////////////////
    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
  
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '365day' })
      res.send({ result, token });
    });
    
////////////////////login korar somoy user je token create kore oita ba useToken er jonno/////////////////
   

   
  } finally {
  }
}
//////////////doctor ke post kora/////////////////

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Mansur Ecoomerce");
});

app.listen(port, () => {
  console.log(`Mansur  on port ${port}`);
});
