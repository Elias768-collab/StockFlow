import express from "express";
import ejs from "ejs"
import dotenv from "dotenv";
import productRoutes from "./routes/productRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js"

dotenv.config();

const app = express();

app.set("view engine", "ejs")
const PORT = process.env.PORT || 4000;

// Parse incoming JSON request bodies from client
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Files accessed by the browser
app.use(express.static("public"));

app.get("/products/add", (req, res) => {
    res.render("add-product");
});

app.get("/products/edit/:id", (req, res) => {
    res.render("edit-product");
});

app.use("/products", productRoutes);

// Product routes
app.use('/products', productRoutes);

// Category routes
app.use("/categories", categoryRoutes);

// Dashboard route
app.get("/dashboard", (req, res) => {
    res.render("dashboard");
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
