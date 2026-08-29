// Importing express packages
import express from "express";

import {
     getProducts,
     getProduct,
     createNewProduct,
     updateExistingProduct,
     deleteExistingProduct
 } from "../controllers/productController.js";

 import validate from "../middleware/validationMiddleware.js";
 import productSchema from "../validators/productValidator.js";

const router = express.Router();

// Get all products
router.get("/", getProducts);
// Get product by ID
router.get("/:id", getProduct);

// Create new product
// Validate(productSchema) checks req.body before the controller runs
router.post("/", validate(productSchema),createNewProduct);

// Update a product
router.put("/:id", updateExistingProduct);

// Deleting an existing product
router.delete("/:id", deleteExistingProduct)

export default router;