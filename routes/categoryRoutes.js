import express from "express";

import {
    getCategories,
    getCategory,
    createNewCategory,
    updateExistingCategory,
    removeExistingCategory
 } from "../controllers/categoryController.js";

const router = express.Router();

// Get all categories
router.get("/", getCategories);

// Get a single category
router.get("/:id",getCategory);

// Create a new category
router.post("/", createNewCategory);

// Update an existing category
router.put("/:id", updateExistingCategory);

// Remove an existing category from database
router.delete("/:id", removeExistingCategory);


export default router;