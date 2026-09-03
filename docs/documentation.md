## PROJECT PURPOSE

StockFlow is an inventory management system designed to help businesses track products, categories, and stock levels in a reliable, structured way. Rather than relying on spreadsheets or ad-hoc tools, it gives users a centralized system to record what products exist, which category each belongs to, and how much stock is on hand, with the data integrity guarantees a relational database provides: no duplicate SKUs, no negative stock, no orphaned products.

The goal is a foundation that's simple enough to build on incrementally, but structured enough to grow into a full inventory/order management tool without needing a rewrite.

## CURRENT ARCHITECTURE

config: database configuration, connection setup, environment loading
controllers: request/response logic, receives requests, calls models, sends responses
database: SQL schema, table definitions, migrations, seed data
middleware: request processing, validation, authentication, error handling
validator: ensuring data entered meet strict rules
models: database interaction, queries and data access logic
routes: endpoint definitions, maps URLs to controller actions
views: server-rendered interface, templates rendered on the backend
public: frontend assets, CSS, client-side JS, images

This separation means, for example, that a change to how a product is validated lives in middleware, not scattered across controllers, and a change to how data is queried lives in models, not duplicated across routes.

## Database Decision: MySQL to PostgreSQL

StockFlow originally considered MySQL as the database engine, since it's a common default for many web projects. During development, MySQL's installation and local setup process introduced enough friction, configuration issues, inconsistent local environment behavior, that it started slowing down actual feature work.

The project switched to PostgreSQL instead. This isn't hidden or glossed over, it's documented deliberately, because why a decision was made is often more useful to future you, or a teammate, than the decision itself. Knowing that MySQL was tried first and dropped for setup reasons prevents someone from re-proposing it later without knowing that history, and explains why the schema uses Postgres-specific features like identity columns rather than staying engine-agnostic.

This is treated as a normal, healthy part of engineering, not a mistake to bury.

## Database Architecture

categories has a one-to-many relationship with products. A single category can have many products, but each product belongs to exactly one category. This is modeled with a category_id foreign key on the products table, referencing categories.id.

Why category_id lives on products and not the other way around: in a one-to-many relationship, the foreign key always goes on the many side. If categories held a reference to products instead, a category could only ever point to one product, the opposite of what's needed. Putting category_id on products lets any number of products point back to the same category, which correctly models a category like Electronics containing many products while each product has exactly one category.

## Important Database Decisions

PostgreSQL identity columns are used for generated primary keys, GENERATED ALWAYS AS IDENTITY, rather than the older SERIAL type, since identity columns are the modern SQL-standard approach and behave more predictably with sequence ownership and permissions.

Numeric types, NUMERIC or DECIMAL, are used for monetary values instead of FLOAT or REAL, to avoid floating-point rounding errors in prices and totals.

Constraints, such as CHECK constraints, are used to prevent invalid inventory values, such as stock quantities going negative, enforced at the database level, not just in application code, so bad data can't slip in through any path.

SKU uniqueness is enforced with a UNIQUE constraint on the product SKU column, since SKUs are meant to be a reliable, unambiguous identifier for a product.

Product status is restricted to a fixed set of values, active or inactive, enforced via a CHECK constraint or enum type, so status can't drift into inconsistent free-text values over time.

Connection credentials, host, user, password, database name, are stored in environment variables rather than hardcoded in the codebase, so secrets aren't committed to version control and configuration can differ safely between local, staging, and production.


## Database Connection and Model Layer

### PostgreSQL Connection

StockFlow uses PostgreSQL as its relational database and connects to it through the `pg` package. The database connection is configured in `config/db.js` using a PostgreSQL connection pool.

Database configuration values such as the host, port, database name, username, and password are stored in environment variables and loaded from the `.env` file. This keeps sensitive credentials out of the application source code and allows configuration to change between environments without modifying the codebase.

A connection pool was chosen instead of manually creating a new database connection for every query. The pool manages reusable connections between the application and PostgreSQL, providing a scalable and efficient way for the application to access the database.

### Model Layer

The Model Layer is responsible for communicating directly with the PostgreSQL database. Database queries are kept separate from controllers so that each part of the application has a clear responsibility.

The current product model is located in:

`models/productModel.js`

The model provides functions for the core CRUD operations:

- `getAllProducts()` — retrieves all products from the database.
- `getProductById(id)` — retrieves a single product using its ID.
- `createProduct(productData)` — creates a new product.
- `updateProduct(id, productData)` — updates an existing product.
- `deleteProduct(id)` — deletes a product using its ID.

### Parameterized Queries

Product queries use parameterized SQL queries with placeholders such as `$1`, `$2`, and `$3`. Values are passed separately to the database rather than being directly concatenated into SQL strings.

This approach improves security and helps protect the application against SQL injection attacks.

### Returning Query Results

PostgreSQL's `RETURNING *` clause is used for create, update, and delete operations. This allows the application to immediately receive the affected database record without requiring an additional query.

### Separation of Responsibilities

The application follows a layered structure for database operations:

Client Request
      ↓
Routes
      ↓
Controllers
      ↓
Models
      ↓
PostgreSQL Database


## CONTROLLER AND ROUTE LAYER

### Controller Layer

The Controller Layer is responsible for handling HTTP requests and responses. Controllers act as the connection between the application's routes and the Model Layer.

Controllers do not contain SQL queries. Instead, they receive information from the client, call the appropriate model function, and return an HTTP response.

The current product controller is located in:

`controllers/productController.js`

The Product Controller currently handles the following operations:

- `getProducts()` — retrieves all products.
- `getProduct()` — retrieves a single product by ID.
- `createNewProduct()` — creates a new product using data from the request body.
- `updateExistingProduct()` — updates an existing product using its ID and request body.
- `deleteExistingProduct()` — deletes a product using its ID.

### Route Layer

The Route Layer defines the API endpoints and determines which controller handles each incoming request.

The current product routes are located in:

`routes/productRoutes.js`

The Product API currently provides the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Retrieve all products |
| GET | `/products/:id` | Retrieve a single product |
| POST | `/products` | Create a new product |
| PUT | `/products/:id` | Update an existing product |
| DELETE | `/products/:id` | Delete a product |

### Request and Response Flow

StockFlow currently follows this request flow:

Client
  ↓
Express Route
  ↓
Controller
  ↓
Model
  ↓
PostgreSQL Database

## INPUT VALIDATION AND ERROR HANDLING
### Joi Request Validation

StockFlow uses Joi to validate incoming product data before it reaches the controller and database.

Validation rules are defined separately in:

`validators/productValidator.js`

The validation logic is applied through reusable middleware located in:

`middleware/validationMiddleware.js`

The request flow is:

Client → Route → Validation Middleware → Controller → Model → PostgreSQL

The validation middleware receives a Joi schema and validates `req.body`. Invalid requests are stopped immediately and return a `400 Bad Request` response, while valid requests continue to the appropriate controller.

The same product validation schema is currently used for both product creation and complete product updates because both operations require the same product fields.

### Validation Rules

Product validation currently checks:

* `category_id` must be a positive integer and is required.
* `name` must be a string between 3 and 200 characters and is required.
* `sku` must be a string between 3 and 100 characters and is required.
* `description` is optional and may be an empty string.
* `unit_price` must be a number greater than or equal to zero.
* `quantity_in_stock` must be a non-negative integer.
* `reorder_level` must be a non-negative integer.
* `status`, when provided, must be either `active` or `inactive`.

### Improved Error Handling

The API handles common and expected errors using appropriate HTTP status codes.

| Situation                        | HTTP Status |
| -------------------------------- | ----------- |
| Successful request               | 200         |
| Invalid request data             | 400         |
| Product not found                | 404         |
| Duplicate SKU                    | 409         |
| Unexpected server/database error | 500         |

PostgreSQL error code `23505` is handled specifically for duplicate SKU violations and is translated into a `409 Conflict` response.

Controllers also check whether a requested, updated, or deleted product exists. If no product is found, the API returns a `404 Not Found` response instead of incorrectly reporting a successful operation.

### Design Decision

Validation and database constraints serve different purposes and are both retained:

* Joi provides early validation and user-friendly feedback for incoming API requests.
* PostgreSQL constraints provide final protection for database integrity.

This layered approach prevents invalid data where possible while ensuring the database remains protected even if application-level validation is bypassed.


## QUERY PARAMETER VALIDATION

Joi validation was extended to product listing query parameters.

Validated parameters:

* `search` — optional search term
* `category` — optional positive integer
* `status` — optional `active` or `inactive`
* `page` — optional positive integer
* `limit` — optional positive integer

A reusable validation middleware validates `req.query` before the request reaches the controller.

Invalid query parameters return `400 Bad Request`, while valid parameters proceed to the product listing logic.

This prevents invalid search, filtering, and pagination values from reaching the database.

## CATEGORY OPERATIONS
Implemented the category CRUD layer using PostgreSQL.

* Added category model functions for retrieving, creating, updating, and deleting categories.
* Added category controllers and routes.
* Added handling for missing categories with appropriate `404` responses.
* Tested all category operations successfully with Postman.
* Category relationships with products are protected by the PostgreSQL foreign-key constraint.

