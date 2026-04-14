# API Integration Notes (DummyJSON)

## CRUD Operations Simulation

DummyJSON's POST/PUT/DELETE operations are simulated. They return the updated object but do not persist changes permanently on the server. The local state (Context) will be updated to reflect these changes during the session.

- **GET /products**: Fetches all products.
- **GET /products/:id**: Fetches a single product.
- **GET /products/search?q=...**: Searches products.
- **POST /products/add**: Simulates adding a product.
- **PUT /products/:id**: Simulates updating a product.
- **DELETE /products/:id**: Simulates deleting a product.

> [!IMPORTANT]
> Since changes are not persisted on the server, a refresh will reset the data to the original DummyJSON set.
