// Importing express packages
import express from "express";

import {
     getProducts,
     getProduct,
     createNewProduct,
     updateExistingProduct,
     deleteExistingProduct
 } from "../controllers/productController.js";

const router = express.Router();

// Get all products
router.get("/", getProducts);
// Get product by ID
router.get("/:id", getProduct);

// Create new product
router.post("/", createNewProduct);

// Update a product
router.put("/:id", updateExistingProduct);

// Deleting an existing product
router.delete("/:id", deleteExistingProduct)

export default router;