const form = document.getElementById("edit-product-form");
const formMessage = document.getElementById("form-message");

// Get the product ID from the current URL
const productId = window.location.pathname.split("/").pop();

const loadProduct = async () => {
    try {
        const response = await fetch(`/products/${productId}`);

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message);
        }

        const product = result.data;

        // Fill the form with the existing product data
        document.getElementById("name").value = product.name;
        document.getElementById("sku").value = product.sku;
        document.getElementById("category_id").value = product.category_id;
        document.getElementById("description").value = product.description || "";
        document.getElementById("unit_price").value = product.unit_price;
        document.getElementById("quantity_in_stock").value = product.quantity_in_stock;
        document.getElementById("reorder_level").value = product.reorder_level;
        document.getElementById("status").value = product.status;

    } catch (error) {
        console.error("Error loading product:", error);

        formMessage.textContent = error.message || "Failed to load product.";
    }
};


form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const productData = Object.fromEntries(formData.entries());

    // Convert numeric fields from strings to numbers
    productData.category_id = Number(productData.category_id);
    productData.unit_price = Number(productData.unit_price);
    productData.quantity_in_stock = Number(productData.quantity_in_stock);
    productData.reorder_level = Number(productData.reorder_level);

    try {
        const response = await fetch(`/products/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message);
        }

        formMessage.textContent = "Product updated successfully.";

        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 500);

    } catch (error) {
        console.error("Error updating product:", error);

        formMessage.textContent =
            error.message || "Failed to update product.";
    }
});

loadProduct();