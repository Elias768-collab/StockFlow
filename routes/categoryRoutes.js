import express from "express";

import {
    getCategories,
    getCategory,
    createNewCategory,
    updateExistingCategory,
    removeExistingCategory
 } from "../controllers/categoryController.js";
 
 import categorySchema from "../validators/categoryValidator.js";
 import validate from "../middleware/validationMiddleware.js";

const router = express.Router();

// Get all categories
router.get("/", getCategories);

// Get a single category
router.get("/:id",getCategory);

// Create a new category
router.post("/", validate(categorySchema), createNewCategory);

// Update an existing category
router.put("/:id", validate(categorySchema), updateExistingCategory);

// Remove an existing category from database
router.delete("/:id", removeExistingCategory);


export default router;