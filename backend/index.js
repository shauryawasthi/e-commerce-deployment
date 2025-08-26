const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const path = require("path");

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://shiv:Shiva%402003@cluster0.oi1gnwe.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(port, () => {
      console.log("🚀 Server running on port " + port);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:");
    console.error(err);
  });

// ✅ Mongoose Schema + Model (Inline)
const ProductSchema = new mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: {
    type: Date,
    default: Date.now
  },
  available: {
    type: Boolean,
    default: true
  }
});
const Product = mongoose.model("Product", ProductSchema);

// ✅ Base route
app.get("/", (req, res) => {
  res.send("✅ Express App is Running");
});

// ✅ Multer image upload config
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images'));

// ✅ POST /upload - Upload image
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// ✅ POST /addproduct - Save product to DB
app.post('/addproduct', async (req, res) => {
  try {
    let products = await Product.find({});
let id;
if(products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
}
else id=1;
    const product = new Product({
      
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    console.log("📦 New Product:", product);

    await product.save();
    console.log("✅ Product saved to DB");

    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});
// Creating API For deleting Products
app.post('/removeproduct', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.body.id); // ✅ CORRECT
    
    if (!result) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    console.log("Removed:", result.name);
    res.json({
      success: true,
      name: result.name,
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
    type:Date,
    default:Date.now,
}
    
})

// Creating API for getting all products
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})


// Creating Endpoint for Registering the user.
app.post('/signup',async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if (check) {
        res.status(400).json({success:false,errors:"existing user found with same email"});
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

const data = {
    user:{
        id:user.id
    }
}

const token = jwt.sign(data, 'secret_ecom');
res.json({success:true,token})
})


app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong Email"})
    }
})


// creating endpoint for newcollection data
app.get('/newcollections', async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})