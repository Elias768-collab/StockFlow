# StockFlow — Inventory & Product Operations Platform

StockFlow is a backend-focused inventory and product operations platform designed to provide a structured way to manage products and categories while keeping inventory information organized and accessible.

The project combines a RESTful backend API with a functional browser-based interface, allowing product operations performed through the frontend to communicate directly with the backend and PostgreSQL database.

## Current Status

MVP completed.

The current MVP supports product and category management through the backend API, together with a functional frontend for viewing, creating, updating, and deleting products.

## Features

### Product Management

* Create products
* View all products
* View an individual product
* Update products
* Delete products
* Search products
* Filter products by category and status
* Paginate product results

### Category Management

* Create categories
* View categories
* View an individual category
* Update categories
* Delete categories

### Validation & Error Handling

* Request validation using Joi
* Validation of product and category data
* Query parameter validation
* Category and product-specific error handling
* Appropriate HTTP status codes and responses
* Parameterized PostgreSQL queries

### Functional Frontend

* Product dashboard
* Product table
* Add Product form
* Edit Product form
* Delete Product action
* Frontend connected to the backend API
* Dashboard reflects changes made to the database

## Tech Stack

* **JavaScript**
* **Node.js**
* **Express.js**
* **PostgreSQL**
* **pg (node-postgres)**
* **Joi**
* **EJS**
* **HTML**
* **CSS**
* **Git & GitHub**

## Architecture

StockFlow follows a layered backend structure that separates responsibilities across routes, controllers, models, and validation.

Client / Browser
       ↓
     EJS
       ↓
Browser JavaScript
       ↓
Express Routes
       ↓
Controllers
       ↓
Models
       ↓
PostgreSQL


The frontend communicates with the backend through HTTP requests rather than connecting directly to the database.

## Project Structure

StockFlow/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── productController.js
│   └── categoryController.js
│
├── models/
│   ├── productModel.js
│   └── categoryModel.js
│
├── routes/
│   ├── productRoutes.js
│   └── categoryRoute.js
│
├── validators/
│   ├── productValidator.js
│   ├── productQueryValidator.js
│   └── categoryValidator.js
│
├── views/
│   ├── dashboard.ejs
│   ├── add-product.ejs
│   └── edit-product.ejs
│
├── public/
│   ├── dashboard.js
│   ├── add-product.js
│   ├── edit-product.js
│   └── style.css
│
├── docs/
│   └── documentation.md
│
├── changelog.md
├── server.js
├── package.json
├── package-lock.json
└── .gitignore


## Running the Project Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd stockflow-inventory-and-product-operations-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and provide the PostgreSQL connection details required by the application.

Keep the `.env` file private and do not commit it to GitHub.

### 4. Start the development server

```bash
npm run dev
```

The application can then be accessed through the local server address configured in `server.js`.

## API Overview

### Products

| Method | Endpoint        | Purpose                                            |
| ------ | --------------- | -------------------------------------------------- |
| GET    | `/products`     | Get products with search, filtering and pagination |
| GET    | `/products/:id` | Get a single product                               |
| POST   | `/products`     | Create a product                                   |
| PUT    | `/products/:id` | Update a product                                   |
| DELETE | `/products/:id` | Delete a product                                   |

### Categories

| Method | Endpoint          | Purpose               |
| ------ | ----------------- | --------------------- |
| GET    | `/categories`     | Get all categories    |
| GET    | `/categories/:id` | Get a single category |
| POST   | `/categories`     | Create a category     |
| PUT    | `/categories/:id` | Update a category     |
| DELETE | `/categories/:id` | Delete a category     |

## Development Documentation

Additional project documentation is available in:

* `docs/documentation.md` — architectural decisions and project development documentation.
* `docs/changelog.md` — development milestones and completed changes.

## Project Direction

The MVP establishes the core product and category management foundation for StockFlow.

Future versions can expand the platform with additional inventory operations, authentication and authorization, richer analytics, suppliers, stock movement tracking, and other business-oriented features.

## Author

Elias Israel

Github repository URL: https://github.com/Elias768-collab/StockFlow

Backend Developer
