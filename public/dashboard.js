const productsContainer = document.getElementById("products-container");

const loadProducts = async () => {
    try {
        const response = await fetch("/products");

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        displayProducts(result.data);

    } catch (error) {
        console.error("Error loading products:", error);

        productsContainer.innerHTML = `
            <p>Failed to load products.</p>
        `;
    }
};

productsContainer.addEventListener("click", async (event) => {

    if (!event.target.classList.contains("delete-btn")) {
        return;
    }

    const productId = event.target.dataset.id;

    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`/products/${productId}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message);
        }

        // Reload products after successful deletion
        loadProducts();

    } catch (error) {
        console.error("Error deleting product:", error);

        alert(error.message || "Failed to delete product.");
    }
});


const displayProducts = (products) => {

    if (products.length === 0) {
        productsContainer.innerHTML = `
            <tr>
                <td colspan="7">No products found.</td>
            </tr>
        `;
        return;
    }

    productsContainer.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>₦${Number(product.unit_price).toLocaleString()}</td>
            <td>${product.quantity_in_stock}</td>
            <td>${product.reorder_level}</td>
            <td>
                <span class="status ${product.status}">
                    ${product.status}
                </span>
            </td>

            <td>
                <a href="/products/edit/${product.id}" class="edit-btn">
                    Edit
                </a>

                <button
                    class="delete-btn"
                    data-id="${product.id}">
                    Delete
                </button>
            </td>

        </tr>
    `).join("");
};


// Load products when dashboard opens
loadProducts();