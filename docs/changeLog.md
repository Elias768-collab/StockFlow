DATABASE FOUNDATION

Database foundation completed and verified in pgAdmin. The categories and products tables have been created, and their relationship, products.category_id referencing categories.id, along with the constraints above (identity columns, numeric fields, SKU uniqueness, status restriction, inventory checks) have been manually verified in pgAdmin.

Next steps: build out the models layer for querying these tables, then wire up basic routes and controllers for CRUD operations on categories and products.

