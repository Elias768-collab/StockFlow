## DATABASE FOUNDATION

Database foundation completed and verified in pgAdmin. The categories and products tables have been created, and their relationship, products.category_id referencing categories.id, along with the constraints above (identity columns, numeric fields, SKU uniqueness, status restriction, inventory checks) have been manually verified in pgAdmin.

Next steps: build out the models layer for querying these tables, then wire up basic routes and controllers for CRUD operations on categories and products.

## DATABASE CONNECTION AND PRODUCT MODEL LAYER

### Completed

- Configured PostgreSQL database connectivity using the `pg` package.
- Created a PostgreSQL connection pool in `config/db.js`.
- Moved database configuration values to environment variables.
- Successfully tested the connection between Node.js and PostgreSQL.
- Created the Product Model in `models/productModel.js`.
- Implemented and tested the core CRUD operations:
  - Retrieve all products.
  - Retrieve a product by ID.
  - Create a product.
  - Update a product.
  - Delete a product.
- Used parameterized queries for database operations.
- Used PostgreSQL's `RETURNING` clause to retrieve records affected by create, update, and delete operations.
- Verified database operations independently using PostgreSQL and pgAdmin.

### Notes

Temporary tests were performed from `server.js` while building the model layer. These test queries were removed after successful verification so that database operations remain the responsibility of the model and will later be called through the controller layer.