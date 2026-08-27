Project Purpose

StockFlow is an inventory management system designed to help businesses track products, categories, and stock levels in a reliable, structured way. Rather than relying on spreadsheets or ad-hoc tools, it gives users a centralized system to record what products exist, which category each belongs to, and how much stock is on hand, with the data integrity guarantees a relational database provides: no duplicate SKUs, no negative stock, no orphaned products.

The goal is a foundation that's simple enough to build on incrementally, but structured enough to grow into a full inventory/order management tool without needing a rewrite.

Current Architecture

config: database configuration, connection setup, environment loading
controllers: request/response logic, receives requests, calls models, sends responses
database: SQL schema, table definitions, migrations, seed data
middleware: request processing, validation, authentication, error handling
models: database interaction, queries and data access logic
routes: endpoint definitions, maps URLs to controller actions
views: server-rendered interface, templates rendered on the backend
public: frontend assets, CSS, client-side JS, images

This separation means, for example, that a change to how a product is validated lives in middleware, not scattered across controllers, and a change to how data is queried lives in models, not duplicated across routes.

Database Decision: MySQL to PostgreSQL

StockFlow originally considered MySQL as the database engine, since it's a common default for many web projects. During development, MySQL's installation and local setup process introduced enough friction, configuration issues, inconsistent local environment behavior, that it started slowing down actual feature work.

The project switched to PostgreSQL instead. This isn't hidden or glossed over, it's documented deliberately, because why a decision was made is often more useful to future you, or a teammate, than the decision itself. Knowing that MySQL was tried first and dropped for setup reasons prevents someone from re-proposing it later without knowing that history, and explains why the schema uses Postgres-specific features like identity columns rather than staying engine-agnostic.

This is treated as a normal, healthy part of engineering, not a mistake to bury.

Database Architecture

categories has a one-to-many relationship with products. A single category can have many products, but each product belongs to exactly one category. This is modeled with a category_id foreign key on the products table, referencing categories.id.

Why category_id lives on products and not the other way around: in a one-to-many relationship, the foreign key always goes on the many side. If categories held a reference to products instead, a category could only ever point to one product, the opposite of what's needed. Putting category_id on products lets any number of products point back to the same category, which correctly models a category like Electronics containing many products while each product has exactly one category.

Important Database Decisions

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