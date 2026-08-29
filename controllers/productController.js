import { 
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
 } from "../models/productModel.js";

// Get all products
const getProducts = async (req, res) => {
    try {

        // Call the product model
        const products = await getAllProducts();

        // Send a successful response message
        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        console.log("Error fetching the products:", error);

        // Handle database error
        res.status(500).json({
            success: false,
            message: "Failed to fetch the products"
        });
    }
};


// Get a single product by ID
const getProduct = async (req, res) => {
    try {
        // Getting product id from the URL
        const { id } = req.params;

        const product = await getProductById(id);

        // If no product was found
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // If the product searched by the ID was found
        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        console.error("Get product error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
};


// Create new product
const createNewProduct = async (req, res) => {
    try {
        const product = await createProduct(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });

    } catch(error) {
        console.error("Create product error:", error);

        // PostgreSQL unique violation
        if (error.code === "23505") {
           return res.status(409).json({
                success: false,
                message: "A product with this unique SKU already exists"
            });
    }

    //   Unexpected error
      res.status(500).json({
        success: false,
        message: "Failed to create product"
      }); 
    }   
};


// Update an existing product
const updateExistingProduct = async(req, res) => {
    try {
        const {id} = req.params;

        const updatedProduct = await updateProduct(id, req.body);

        // Product with the ID does not exist
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error) {
        console.log("Error updating a product", error);

    // Handle duplicate SKU
     if (error.code === "23505") {
        res.status(500).json({
            success: false,
            message: "Product with this SKU  already exists"
        });
    }

     res.status(500).json({
        success: false,
        message: "Failed to update product"
     })
   }  
};

// Delete a product by ID
const deleteExistingProduct = async (req, res) => {
    try {
        const {id} = req.params;

        const deletedProduct = await deleteProduct(id);

        // Product with the ID does not exist
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product does not exist"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct
        });

    } catch (error) {
        console.error("Error deleting a product", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete a product"
        });
    }
};

export {
    getProducts,
    getProduct,
    createNewProduct,
    updateExistingProduct,
    deleteExistingProduct
};