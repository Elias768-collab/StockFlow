import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Parse incoming JSON request bodies from client
app.use(express.json());

// Product routes
app.use('/products', productRoutes);

// Category routes
app.use("/categories", categoryRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
