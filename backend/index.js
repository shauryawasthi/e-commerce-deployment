const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const app = express();

// 🔹 Render ke liye PORT dynamic hona zaruri hai
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// ✅ MongoDB Atlas Connection (hardcoded)
mongoose.connect("mongodb+srv://shiv:Shiva%402003@cluster0.oi1gnwe.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });

// ✅ Product Schema
const ProductSchema = new mongoose.Schema({
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});
const Product = mongoose.model("Product", ProductSchema);

// ✅ User Schema
const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  date: { type: Date, default: Date.now }
});

// ✅ Base route
app.get("/", (req, res) => {
  res.send("✅ Express App is Running (Deployed on Render)");
});

// ✅ Multer config for image uploads
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images'));

// ✅ Image Upload
app.post("/upload", upload.single('product'), (req, res) => {
  const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  res.json({ success: 1, image_url: imageUrl });
});

// ✅ Add Product
app.post('/addproduct', async (req, res) => {
  try {
    let products = await Product.find({});
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
});

// ✅ Remove Product
app.post('/removeproduct', async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.body.id);
    if (!result) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, name: result.name });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ✅ Get All Products
app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  res.send(products);
});

// ✅ Signup
app.post('/signup', async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) return res.status(400).json({ success: false, errors: "User already exists" });

  let cart = {};
  for (let i = 0; i < 300; i++) cart[i] = 0;

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();
  const data = { user: { id: user.id } };
  const token = jwt.sign(data, "secret_ecom"); // 🔹 Hardcoded secret
  res.json({ success: true, token });
});

// ✅ Login
app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (!user) return res.json({ success: false, errors: "Wrong Email" });

  if (req.body.password === user.password) {
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, "secret_ecom"); // 🔹 Hardcoded secret
    res.json({ success: true, token });
  } else {
    res.json({ success: false, errors: "Wrong Password" });
  }
});

// ✅ New Collections
app.get('/newcollections', async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(-8);
  res.send(newcollection);
});
