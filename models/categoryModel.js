import pool from "../config/db.js";

// Get all category
const getAllCategories = async () => {
    const result = await pool.query (
        "SELECT * FROM categories ORDER BY id ASC"
    );

    return result.rows;
}


// Get category by ID
const getCategoryById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM categories WHERE id = $1",
        [id]
    );

    return result.rows[0];
}

// Create a new category
const createCategory = async (categoryData) => {
    const  { name, description, status } = categoryData;

    const result = await pool.query(
        `INSERT INTO categories (name, description, status)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [name, description, status]
    );

    return result.rows[0];
}

// Update an existing category
const updateCategory = async (id, categoryData) => {
    const { name, description, status} = categoryData;

    const result = await pool.query(
        `UPDATE categories
        SET name = $1,
            description = $2,
            status = $3,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *`,
        [name, description, status, id]
    );

    return result.rows[0];
}

// Deleting an already existing category
const deleteCategory = async (id) => {
    const result = await pool.query(
        `DELETE FROM categories
        WHERE id = $1
        RETURNING *`,
        [id]
    );

    return result.rows[0];
}

export { 
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
 };