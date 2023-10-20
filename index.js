const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())

console.log(process.env.DB_USER);





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqq4klv.mongodb.net/?retryWrites=true&w=majority`;

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
    const database = client.db("productDB");
    const userCollection = database.collection("product");
    const cartCollection = database.collection("Cart")

    app.get('/products',async(req,res) =>{
      const cursor = userCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    } )


    app.get('/products/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result= await userCollection.findOne(query);
      res.send(result)
    })
    
    app.get('/products/:brandName', async (req, res) => {
      const brandName = req.params.brandName;
      const query = { brand: brandName };
      const products = await userCollection.find(query).toArray();
      res.send(products);
  });

  
  

    

    app.post('/products',async(req,res)=>{
        const product = req.body;
        console.log(product);
        const result = await userCollection.insertOne(product);
        res.send(result)
    } )

    app.put('/products/:id', async(req,res)=>{
      const id = req.params.id
      const updateUser = req.body
      console.log(updateUser);
      const filter = {_id : new ObjectId(id)}
      const update = {
          $set:{
            name: updateUser.name,
            photo:updateUser.photo,
             brand: updateUser.brand, 
             type: updateUser.type,
              price : updateUser.price,
               description: updateUser.description,
                rating: updateUser.rating
          }
      }
      const result = await userCollection.updateOne(filter,update)
      res.send(result)
  })


     app.get('/cart', async(req,res)=>{
      const cursor= cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
     })

     app.post('/cart',async(req,res)=>{
      const newCart = req.body;
      const result = await cartCollection.insertOne(newCart)
      res.send(result)
     })
     app.delete('/cart/:id', async(req,res)=>{
      const id = req.params.id;
      const query= {_id :new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
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


app.get('/',(req,res)=>{
    res.send('my brands server ongoing')
})

app.listen(port, ()=>{
    console.log(`my server port in ongoing at ${port}`);
})