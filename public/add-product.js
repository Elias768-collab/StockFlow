const form = document.getElementById("add-product-form");
const formMessage = document.getElementById("form-message");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const productData = Object.fromEntries(formData.entries());

    productData.category_id = Number(productData.category_id);
    productData.unit_price = Number(productData.unit_price);
    productData.quantity_in_stock = Number(productData.quantity_in_stock);
    productData.reorder_level = Number(productData.reorder_level);

    try {
        const response = await fetch("/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(productData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        formMessage.textContent = "Product created successfully.";

        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 500);

    } catch (error) {
        console.error("Error creating product:", error);

        formMessage.textContent = error.message || "Failed to create product.";
    }
});