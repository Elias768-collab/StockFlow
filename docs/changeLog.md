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

## PRODUCT CONTROLLER AND ROUTE LAYER
### Completed

- Created the Product Controller in `controllers/productController.js`.
- Connected Product Model functions to HTTP request and response handling.
- Implemented controllers for all core product CRUD operations.
- Created Product API routes in `routes/productRoutes.js`.
- Connected the product routes to the Express application.
- Added `express.json()` middleware to support JSON request bodies.
- Implemented the following API endpoints:
  - `GET /products`
  - `GET /products/:id`
  - `POST /products`
  - `PUT /products/:id`
  - `DELETE /products/:id`
- Added appropriate HTTP status codes for successful and unsuccessful requests.
- Added 404 handling when a requested product does not exist.

### Testing

- Successfully tested all Product CRUD endpoints using Postman.
- Tested retrieval of all products and a single product.
- Tested creation and updating of products using JSON request bodies.
- Tested deletion and verified that deleted products could no longer be retrieved.
- Tested a duplicate SKU to confirm that the database constraint rejects duplicate values through the API.
- Tested requests for products that do not exist and confirmed that the API returns a 404 response.

## INPUT VALIDATION AND IMPROVED HANDLING
### Completed

* Installed and configured Joi for request validation.
* Created a product validation schema in `validators/productValidator.js`.
* Created reusable validation middleware in `middleware/validationMiddleware.js`.
* Applied request validation to `POST /products`.
* Applied request validation to `PUT /products/:id`.
* Tested valid product requests successfully.
* Tested negative price validation.
* Tested missing required fields.
* Tested invalid data types.
* Added handling for duplicate SKU errors using PostgreSQL error code `23505`.
* Returned `409 Conflict` for duplicate SKU attempts.
* Added `404 Not Found` handling for nonexistent products during retrieval.
* Added `404 Not Found` handling for nonexistent products during updates.
* Confirmed deletion behavior and error handling for nonexistent products.
* Retained `500 Internal Server Error` responses for unexpected failures.

### Result

StockFlow now validates incoming product data before it reaches the database and provides more meaningful HTTP responses for common API and database errors.

## PRODUCT SEARCH, FILTERING AND PAGINATION
### Completed

* Added product search by name.
* Added category filtering.
* Added status filtering.
* Added pagination using `page` and `limit`.
* Combined search, filtering, and pagination.
* Added Joi validation for product query parameters.
* Tested valid and invalid query parameters successfully.

### Result

`GET /products` now supports searching, filtering, and pagination with validated query parameters.

##  CATEGORY CRUD
### Completed

* Added `getAllCategories()`
* Added `getCategoryById()`
* Added `createCategory()`
* Added `updateCategory()`
* Added `deleteCategory()`
* Added category controllers and routes.
* Tested category CRUD operations successfully with Postman.

