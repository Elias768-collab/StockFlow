import { 
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
 } from "../models/categoryModel.js";

const getCategories = async (req, res) => {
    try {

        // Get all categories from the model
        const categories = await getAllCategories();

        // Send a successful response
        res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {
        console.log("Error fetching categories", error);

        // Handle database/server error
        res.status(500).json({
            success: false,
            message: "Failed to fetch categories"
        });
    }
};

// Get a single category
const getCategory = async (req, res) => {
    try {

        // Get category ID from the URL
        const { id } = req.params;

        // Get a category by ID from the model
        const category = await getCategoryById(id);

        // If the category does not exist
        if(!category) {
            return res.status(404).json({
                success: false,
                messag: "Category not found"
            });
        }

        //  If the category is found
        res.status(200).json({
            success: true,
            data: category
        })

    } catch (error) {
        console.log("Error fetching category", error);

        // Handle database/server error
        res.status(500).json({
            success: false,
            message: "Failed to fetch category"
        });
    }
};


// Create a new category
const createNewCategory = async (req, res) => {
    try {

        //Get category information from request body
        const category = await createCategory(req.body);

        // Send newly created category
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });

    } catch (error) {
        console.log("Error creating category", error);

        // PostgreSQL unique violation
        if( error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "Category name already exists"
            });
        }

            res.status(500).json({
            success: false,
            message: "Failed to create category"
        }); 
    }
};

// Update an existing category
const updateExistingCategory = async (req, res) => {
    try {
        // Get category ID from the URL
        const { id } = req.params;

        // Update category using the data from request body
        const category = await updateCategory(id, req.body);

        // Category not found
        if(!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Category updated successfully
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category
        });

    } catch (error) {
        console.log("Error updating category", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch category"
        });
    }
};


// Delete a category
const removeExistingCategory = async (req, res) => {
    try {
        // Get category ID from the URL
        const { id } = req.params;

        // Delete category
        const category = await deleteCategory(id);

        // If category does not exist
        if(!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Category deleted successfully
        res.status(200).json({
            success: true,
            messag: "Category deleted successfully",
            data: category
        });

    } catch (error) {
        console.log("Error deleting category", error);

        // Category is still referenced by products
        // Category being used by products
        if (error.code === "23503") {
            return res.status(409).json({
                success: false,
                message: "Cannot delete category because it is assigned to one or more products"
            })
        }

        res.status(500).json({
            success: false,
            message: "Failed to delte category"
        });
    }
};

export { 
    getCategories,
    getCategory,
    createNewCategory,
    updateExistingCategory,
    removeExistingCategory
 };