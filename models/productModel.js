/**
 * Importing the pool from config/db.js
 * This get access the PostgreSQL connecction pool
 */
import pool from '../config/db.js';

// Get all products
const getAllProducts = async (
    search, 
    category, 
    status,
    page,
    limit
) => {

    // Base query
    let query = `SELECT * FROM products WHERE 1=1`;

    // Values passed safely to PostgreSQL
    const values = [];

    // Add search filter if provided
    // Search by name
    if (search) {
        values.push(`%${search}%`);
        query += ` AND name ILIKE $${values.length}`;
    }

    // Filter by category
    if (category) {
        values.push(category);
        query += ` AND category_id = $${values.length}`;
    }

    // Filter by product status
    if (status) {
        values.push(status);
        query += ` AND status = $${values.length}`;
    }

    // Convert page and limit to numbers
    const currentPage = Number(page) || 1;
    const itemsPerPage = Number(limit) || 10;

    // Calculate the number of records to skip
    const offset = (currentPage -1) * itemsPerPage;

    // Sort products before applying pagination
    query += ' ORDER BY id ASC';

    // Add LIMIT
    values.push(itemsPerPage);
    query += ` LIMIT $${values.length}`;

    // Add OFFSET
    values.push(offset);
    query += ` OFFSET $${ values.length}`;

    const result = await pool.query(query, values);

    // Rturns the information contain in the rows(e.g the actual products)
    return result.rows;
};

// Get a  product by ID
const getProductById = async (id) => {
    const result = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
    );

    // Return a single product
    return result.rows[0]
};

// Creat a new product
const createProduct = async (productData) => {

    const {
        category_id,
        name,
        sku,
        description,
        unit_price,
        quantity_in_stock,
        reorder_level
    } = productData;

    const result = await pool.query(
        `
        INSERT INTO products (
            category_id,
            name,
            sku,
            description,
            unit_price,
            quantity_in_stock,
            reorder_level
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *
        `,
        [
            category_id,
            name,
            sku,
            description,
            unit_price,
            quantity_in_stock,
            reorder_level 
        ]
    );
    
    // Return newly created product
    return result.rows[0];
};


// Update an existing product
const updateProduct = async (id, productData) => {
    const {
        category_id,
        name,
        sku,
        description,
        unit_price,
        quantity_in_stock,
        reorder_level,
        status
    } = productData;

    const result = await pool.query(
        `
        UPDATE products
        SET
            category_id = $1,
            name = $2,
            sku = $3,
            description = $4,
            unit_price = $5,
            quantity_in_stock = $6,
            reorder_level = $7,
            status = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *
        `,
        [
            category_id,
            name,
            sku,
            description,
            unit_price,
            quantity_in_stock,
            reorder_level,
            status,
            id
        ]
    );

    // Return the updated product
    return result.rows[0];
};

// Deleting a product by ID
const deleteProduct = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM products
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );

    // Return the deleted product
    return result.rows[0];
};


export { 
    getAllProducts, 
    getProductById, 
    createProduct,
    updateProduct,
    deleteProduct
 };