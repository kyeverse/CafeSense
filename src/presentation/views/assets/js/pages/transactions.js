
import { transactionApi } from '../api/transactionApi.js';
import { productApi } from '../api/productApi.js';
import { apiClient } from '../api/apiClient.js';
import { getProductImageUrl } from '../utils/productImage.js';

document.addEventListener("DOMContentLoaded", async () => {

    // ==========================================
    // AUTHENTICATION CHECK
    // ==========================================

    try {
        const response = await apiClient.get("/auth/me");

        if (!response.success || !response.data?.user) {
            window.location.replace("login.html");
            return;
        }

        const currentUser = response.data.user;

        // Owner, Manager, and Staff can access Transactions.
        const allowedRoles = ["owner", "manager", "staff"];

        const currentRole = String(currentUser.role || "")
            .trim()
            .toLowerCase();

        if (!allowedRoles.includes(currentRole)) {
            window.location.replace("dashboard.html");
            return;
        }

        // ==========================================
        // UPDATE LOGGED-IN USER PROFILE
        // ==========================================

        const fullName = currentUser.fullName || currentUser.username;
        const roleName = String(currentUser.role || "Staff").trim();
        const normalizedRole = roleName.toLowerCase();

        const displayName = document.getElementById("display-user-name");

        if (displayName) {
            displayName.textContent = fullName;
        }

        const displayRole = document.getElementById("display-user-role")
            || document.querySelector(".user-role");

        if (displayRole) {
            displayRole.textContent = roleName;
        }

        const avatar = document.getElementById("display-user-avatar")
            || document.querySelector(".user-avatar-placeholder");

        if (avatar) {
            const initials = fullName
                .split(" ")
                .filter(part => part.length > 0)
                .map(part => part[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();

            avatar.textContent = initials;
        }

        const roleBadge = document.getElementById("role-badge")
            || document.querySelector(".role-badge");

        if (roleBadge) {
            roleBadge.textContent = `${roleName} Portal`;
        }

        // ==========================================
        // ROLE-BASED SIDEBAR VISIBILITY
        // ==========================================

        document.querySelectorAll(".owner-manager-only").forEach(section => {
            section.style.display =
                ["owner", "manager"].includes(normalizedRole)
                    ? ""
                    : "none";
        });

        document.querySelectorAll(".owner-only").forEach(section => {
            section.style.display =
                normalizedRole === "owner"
                    ? ""
                    : "none";
        });

    } catch (error) {
        console.error("Transactions authentication failed:", error);

        if ([401, 403, 404].includes(error.status)) {
            window.location.replace("login.html");
            return;
        }

        document.body.innerHTML = `
            <main style="max-width:600px;margin:80px auto;padding:24px;text-align:center;font-family:Arial,sans-serif;">
                <h2>Unable to Verify Your Session</h2>
                <p>Please make sure the CaféSense backend is running, then try again.</p>
                <button onclick="window.location.reload()">Retry</button>
            </main>
        `;

        return;
    }

    // ==========================================
    // 1. LOCAL STORAGE AND DEFAULT PRODUCTS
    // ==========================================

    const PRODUCTS_STORAGE_KEY = "cafeSenseProducts";
    const TRANSACTIONS_STORAGE_KEY = "cafeSenseTransactions";
    const SIDEBAR_STORAGE_KEY = "cafeSenseSidebarCollapsed";

    const defaultProducts = [
        { id: "P001", name: "Café Latte", category: "Coffee", price: 120, stock: 35 },
        { id: "P002", name: "Americano", category: "Coffee", price: 100, stock: 28 },
        { id: "P003", name: "Cappuccino", category: "Coffee", price: 130, stock: 22 },
        { id: "P004", name: "Caramel Macchiato", category: "Coffee", price: 145, stock: 18 },
        { id: "P005", name: "Spanish Latte", category: "Coffee", price: 140, stock: 30 },
        { id: "P006", name: "Matcha Latte", category: "Non-Coffee", price: 170, stock: 20 },
        { id: "P007", name: "Chocolate Milk", category: "Non-Coffee", price: 110, stock: 25 },
        { id: "P008", name: "Strawberry Milk", category: "Non-Coffee", price: 120, stock: 16 },
        { id: "P009", name: "Blueberry Cheesecake", category: "Pastry / Baked Good", price: 150, stock: 12 },
        { id: "P010", name: "Chocolate Muffin", category: "Pastry / Baked Good", price: 85, stock: 24 },
        { id: "P011", name: "Croissant", category: "Pastry / Baked Good", price: 95, stock: 20 },
        { id: "P012", name: "Chocolate Chip Cookie", category: "Pastry / Baked Good", price: 65, stock: 40 }
    ];

    // ==========================================
    // 2. DISCOUNT RULES
    // ==========================================

    const DISCOUNTS = {
        "General Customer": 0,
        "Student": 10,
        "Senior/PWD": 20
    };

    // ==========================================
    // 3. PRODUCT ICONS
    // ==========================================

function getProductIcon(product) {
    const name = product.name?.trim().toLowerCase() || "";
    const category = product.category?.trim().toLowerCase() || "";

    // ==========================================
    // KEYWORD-BASED ICON DETECTION
    // ==========================================

    // Coffee-based drinks
    if (
        name.includes("frappe") ||
        name.includes("frappé")
    ) {
        return "🥤";
    }

    if (
        name.includes("strawberry")
    ) {
        return "🍓";
    }

    if (name.includes("blueberry")) {
        return "🫐";
    }

    if (name.includes("mango")) {
        return "🥭";
    }

    if (name.includes("matcha")) {
        return "🍵";
    }

    if (
        name.includes("chocolate") &&
        (name.includes("milk") || name.includes("drink"))
    ) {
        return "🥛";
    }

    if (name.includes("milk")
    ) {
        return "🥛";
    }

    if (
        name.includes("americano") ||
        name.includes("cappuccino") ||
        name.includes("macchiato") ||
        name.includes("espresso") ||
        name.includes("coffee") ||
        name.includes("latte")
    ) {
        return "☕";
    }

    if (
        name.includes("iced tea") ||
        name.includes("tea")
    ) {
        return "🧋";
    }

    if (
        name.includes("cheesecake") ||
        name.includes("cake")
    ) {
        return "🍰";
    }

    if (
        name.includes("muffin")
    ) {
        return "🧁";
    }

    if (
        name.includes("croissant")
    ) {
        return "🥐";
    }

    if (
        name.includes("cookie") ||
        name.includes("cookies")
    ) {
        return "🍪";
    }

    if (
        name.includes("cinnamon roll")
    ) {
        return "🥐";
    }

    if (
        name.includes("graham")
    ) {
        return "🍰";
    }

    // ==========================================
    // CATEGORY-BASED FALLBACK
    // ==========================================

    const categoryIcons = {
        "coffee": "☕",
        "non-coffee": "🥤",
        "pastry / baked good": "🥐"
    };

    return categoryIcons[category] || "📦";
}

    // ==========================================
    // 4. HTML ELEMENTS
    // ==========================================

    const productGrid = document.getElementById("productGrid");
    const productSearch = document.getElementById("productSearch");
    const productCount = document.getElementById("productCount");
    const categoryFilters = document.getElementById("categoryFilters");

    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");

    const subtotalValue = document.getElementById("subtotalValue");
    const discountValue = document.getElementById("discountValue");
    const totalValue = document.getElementById("totalValue");

    const paymentMethod = document.getElementById("paymentMethod");
    const cashPaymentGroup = document.getElementById("cashPaymentGroup");
    const cashReceived = document.getElementById("cashReceived");
    const changeRow = document.getElementById("changeRow");
    const changeDue = document.getElementById("changeDue");

    const customerCountInput = document.getElementById("customerCount");

    const clearCartBtn = document.getElementById("clearCartBtn");
    const checkoutBtn = document.getElementById("checkoutBtn");

    const receiptModal = document.getElementById("receiptModal");
    const receiptContent = document.getElementById("receiptContent");
    const printReceiptBtn = document.getElementById("printReceiptBtn");
    const closeReceiptBtn = document.getElementById("closeReceiptBtn");

    const currentDateElement = document.getElementById("current-date");
    const currentTimeElement = document.getElementById("current-time");

    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
    const sidebarClose = document.getElementById("sidebarClose");

    const analyticsDropdownToggle = document.getElementById(
        "analyticsDropdownToggle"
    );

    const analyticsNavList = document.getElementById(
        "analyticsNavList"
    );

    const logoutBtn = document.getElementById("logout-btn");

    // ==========================================
    // 5. POS STATE
    // ==========================================

    let products = [];
    let completedTransactions = [];

    let cart = [];
    let selectedCategory = "All";

    let currentSubtotal = 0;
    let currentDiscount = 0;
    let currentTotal = 0;

    let checkoutInProgress = false;
    let nextLineId = 1;

    let inventoryLoadError = false;

    // ==========================================
    // 6. HELPER FUNCTIONS
    // ==========================================

    function roundMoney(amount) {
        return Math.round(
            (Number(amount) + Number.EPSILON) * 100
        ) / 100;
    }

    function formatPrice(amount) {
        return "₱" + Number(amount).toLocaleString("en-PH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    function getCurrentDate() {
        return new Date().toLocaleString("en-PH", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function generateTransactionId() {
        return "CS-" + Date.now().toString().slice(-8);
    }

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);
    }

    function getProductById(productId) {
        return products.find(
            product => String(product.id) === String(productId)
        );
    }

    function getProductQuantityInCart(productId) {
        return cart
            .filter(item => String(item.id) === String(productId))
            .reduce((total, item) => total + item.quantity, 0);
    }

    function getRemainingStock(productId) {

        const product = getProductById(productId);

        if (!product) return 0;

        return Math.max(
            0,
            product.stock - getProductQuantityInCart(productId)
        );
    }

    // ==========================================
    // 7. CUSTOM SYSTEM DIALOG
    // ==========================================

    let activeConfirmation = null;

    function showSystemDialog({
        title,
        message,
        type = "info",
        confirmText = "OK",
        cancelText = "Cancel",
        onConfirm,
        onClose
    }) {

        if (activeConfirmation) return;

        const isConfirmation = typeof onConfirm === "function";
        const previousFocus = document.activeElement;

        const iconMap = {
            info: "fa-circle-info",
            warning: "fa-triangle-exclamation",
            error: "fa-circle-exclamation",
            success: "fa-circle-check",
            confirm: "fa-circle-question"
        };

        const overlay = document.createElement("div");
        overlay.className = "confirmation-modal";

        overlay.innerHTML = `
            <div
                class="confirmation-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmationTitle"
                aria-describedby="confirmationMessage"
                tabindex="-1"
            >

                <div class="confirmation-icon ${type}">
                    <i class="fa-solid ${iconMap[type] || iconMap.info}"></i>
                </div>

                <h3 id="confirmationTitle">
                    ${escapeHTML(title)}
                </h3>

                <p id="confirmationMessage">
                    ${escapeHTML(message)}
                </p>

                <div class="confirmation-actions">

                    ${
                        isConfirmation
                            ? `
                                <button
                                    type="button"
                                    class="confirmation-btn confirmation-cancel"
                                >
                                    ${escapeHTML(cancelText)}
                                </button>
                            `
                            : ""
                    }

                    <button
                        type="button"
                        class="confirmation-btn confirmation-confirm"
                    >
                        ${escapeHTML(confirmText)}
                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(overlay);

        const dialog = overlay.querySelector(".confirmation-dialog");

        const cancelButton = overlay.querySelector(
            ".confirmation-cancel"
        );

        const confirmButton = overlay.querySelector(
            ".confirmation-confirm"
        );

        let isClosing = false;

        const focusableElements = [
            ...(cancelButton ? [cancelButton] : []),
            confirmButton
        ];

        function closeDialog() {

            if (isClosing) return;

            isClosing = true;

            overlay.classList.remove("active");

            document.body.style.overflow = "";

            document.removeEventListener(
                "keydown",
                handleDialogKeydown
            );

            activeConfirmation = null;

            setTimeout(() => {

                overlay.remove();

                if (
                    previousFocus &&
                    document.contains(previousFocus)
                ) {
                    previousFocus.focus();
                }

                if (typeof onClose === "function") {
                    onClose();
                }

            }, 200);
        }

        function handleDialogKeydown(event) {

            if (event.key === "Escape") {
                event.preventDefault();
                closeDialog();
                return;
            }

            if (event.key === "Tab") {

                const firstElement = focusableElements[0];

                const lastElement =
                    focusableElements[focusableElements.length - 1];

                if (
                    event.shiftKey &&
                    document.activeElement === firstElement
                ) {
                    event.preventDefault();
                    lastElement.focus();

                } else if (
                    !event.shiftKey &&
                    document.activeElement === lastElement
                ) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }

        if (cancelButton) {
            cancelButton.addEventListener("click", closeDialog);
        }

        confirmButton.addEventListener("click", () => {

            if (isClosing) return;

            closeDialog();

            if (typeof onConfirm === "function") {
                onConfirm();
            }
        });

        overlay.addEventListener("click", event => {

            if (event.target === overlay) {
                closeDialog();
            }
        });

        document.addEventListener(
            "keydown",
            handleDialogKeydown
        );

        activeConfirmation = {
            close: closeDialog
        };

        document.body.style.overflow = "hidden";

        requestAnimationFrame(() => {

            overlay.classList.add("active");

            if (cancelButton) {
                cancelButton.focus();
            } else {
                confirmButton.focus();
            }
        });
    }

    function showMessage(title, message, type = "info", onClose) {

        showSystemDialog({
            title,
            message,
            type,
            confirmText: "OK",
            onClose
        });
    }

    function showConfirmation({
        title,
        message,
        confirmText = "Confirm",
        cancelText = "Cancel",
        icon = "fa-circle-question",
        danger = false,
        onConfirm
    }) {

        showSystemDialog({
            title,
            message,
            confirmText,
            cancelText,
            type: danger ? "warning" : "confirm",
            onConfirm
        });

        if (danger) {

            requestAnimationFrame(() => {

                const dialog = document.querySelector(
                    ".confirmation-dialog"
                );

                if (dialog) {
                    dialog.classList.add("confirmation-dialog-danger");
                }
            });
        }
    }

    // ==========================================
    // 8. LOAD INVENTORY PRODUCTS
    // ==========================================

    async function loadProducts() {

        try {

            const response = await productApi.getAll();

            const databaseProducts = response.data;

            if (!Array.isArray(databaseProducts)) {
                throw new Error("Invalid product data received from the API.");
            }

            inventoryLoadError = false;

            return databaseProducts.map(product => ({
                id: String(product.id),
                name: String(product.name),

                category: String(product.category).trim() === "Pastries"
                    ? "Pastry / Baked Good"
                    : String(product.category),

                price: Number(product.price),
                stock: Number(product.stock),
                status: product.status
            }));

        } catch (error) {

            console.error("Unable to load products from database:", error);

            inventoryLoadError = true;

            return [];
        }
    }

    async function refreshProducts() {

        const updatedProducts = await loadProducts();

        if (inventoryLoadError) {
            throw new Error(
                "Unable to refresh inventory from the database."
            );
        }

        products = updatedProducts;

        displayProducts();
    }

    // ==========================================
    // 9. LOAD COMPLETED TRANSACTIONS
    // ==========================================

    async function loadTransactions() {

        try {

            const response = await transactionApi.getAll();

            const databaseTransactions = response.data;

            if (!Array.isArray(databaseTransactions)) {
                throw new Error("Invalid transaction data received from the API.");
            }

            return databaseTransactions;

        } catch (error) {

            console.error(
                "Unable to load transactions from database:",
                error
            );

            showMessage(
                "Transaction History Error",
                "Unable to retrieve transaction history from the database. Please try again.",
                "error"
            );

            return [];
        }
    }

    products = await loadProducts();
    completedTransactions = await loadTransactions();

    // ==========================================
    // 10. RESET CUSTOMER COUNT
    // ==========================================

    function resetCustomerCount() {

        if (!customerCountInput) return;

        customerCountInput.value = "1";

        customerCountInput.dispatchEvent(
            new Event("input", { bubbles: true })
        );

        customerCountInput.dispatchEvent(
            new Event("change", { bubbles: true })
        );
    }

    // ==========================================
    // 11. PRODUCT CATALOG
    // ==========================================

    function displayProducts() {

        if (!productGrid) return;

        const searchTerm = productSearch
            ? productSearch.value.toLowerCase().trim()
            : "";

        const filteredProducts = products.filter(product => {

            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm);

            const matchesCategory =
                selectedCategory === "All" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        if (productCount) {
            productCount.textContent = `${filteredProducts.length} Products`;
        }

        if (filteredProducts.length === 0) {

            productGrid.innerHTML = `
                <div class="empty-products">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <p>No products found.</p>
                </div>
            `;

            return;
        }

        productGrid.innerHTML = filteredProducts.map(product => {

            const remainingStock = getRemainingStock(product.id);

            const stockClass =
                remainingStock <= 0
                    ? "out-of-stock"
                    : remainingStock <= 10
                        ? "low-stock"
                        : "";

            return `
                <div
                    class="product-card"
                    data-product-id="${escapeHTML(product.id)}"
                >

                    <div class="product-image">
                        <img src="${getProductImageUrl(product)}" alt="${escapeHTML(product.name)}" loading="lazy">
                    </div>

                    <div class="product-info">

                        <span class="product-category">
                            ${escapeHTML(product.category)}
                        </span>

                        <h3>${escapeHTML(product.name)}</h3>

                        <p class="product-price">
                            ${formatPrice(product.price)}
                        </p>

                        <span class="product-stock ${stockClass}">
                            ${
                                remainingStock <= 0
                                    ? "Out of Stock"
                                    : `Stock: ${remainingStock} available`
                            }
                        </span>

                    </div>

                    <button
                        type="button"
                        class="add-product-btn"
                        data-product-id="${escapeHTML(product.id)}"
                        ${remainingStock <= 0 ? "disabled" : ""}
                    >

                        <i class="fa-solid fa-plus"></i>

                        ${
                            remainingStock <= 0
                                ? "Unavailable"
                                : "Add to Order"
                        }

                    </button>

                </div>
            `;

        }).join("");
    }

    if (productSearch) {
        productSearch.addEventListener("input", displayProducts);
    }

    if (categoryFilters) {

        categoryFilters.addEventListener("click", event => {

            const filterButton = event.target.closest("[data-category]");

            if (!filterButton) return;

            selectedCategory = filterButton.dataset.category;

            categoryFilters
                .querySelectorAll("[data-category]")
                .forEach(button => {

                    button.classList.toggle(
                        "active",
                        button === filterButton
                    );
                });

            displayProducts();
        });
    }

    // ==========================================
    // 12. ADD PRODUCT TO ORDER
    // ==========================================

    function addToCart(productId) {

        const product = getProductById(productId);

        if (!product) {

            showMessage(
                "Product Unavailable",
                "This product is no longer available.",
                "warning"
            );

            return;
        }

        const availableStock = getRemainingStock(productId);

        if (availableStock <= 0) {

            showMessage(
                "Insufficient Stock",
                `No more stock available for ${product.name}.`,
                "warning"
            );

            return;
        }

        cart.push({
            lineId: nextLineId++,
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: 1,
            customerType: "General Customer"
        });

        updateCart();
    }

    if (productGrid) {

        productGrid.addEventListener("click", event => {

            const addButton = event.target.closest(".add-product-btn");

            if (!addButton || addButton.disabled) return;

            addToCart(addButton.dataset.productId);
        });
    }

    // ==========================================
    // 13. DISPLAY CURRENT ORDER
    // ==========================================

    function displayCart() {

        if (!cartItems) return;

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fa-solid fa-basket-shopping"></i>
                    <p>Your cart is empty.</p>
                    <span>Add products to start an order.</span>
                </div>
            `;

            return;
        }

        cartItems.innerHTML = cart.map(item => {

            const discountRate = DISCOUNTS[item.customerType] ?? 0;

            const lineSubtotal = roundMoney(
                item.price * item.quantity
            );

            const lineDiscount = roundMoney(
                lineSubtotal * discountRate / 100
            );

            const lineTotal = roundMoney(
                lineSubtotal - lineDiscount
            );

            const remainingStock = getRemainingStock(item.id);

            const maxForThisLine = item.quantity + remainingStock;

            return `
                <div class="cart-item" data-line-id="${item.lineId}">

                    <div class="cart-item-info">

                        <div class="cart-item-heading">

                            <h4>${escapeHTML(item.name)}</h4>

                            <strong>${formatPrice(lineTotal)}</strong>

                        </div>

                        <p>${formatPrice(item.price)} each</p>

                        <label
                            class="cart-customer-label"
                            for="customerType-${item.lineId}"
                        >
                            Customer Type
                        </label>

                        <select
                            class="cart-customer-type"
                            id="customerType-${item.lineId}"
                            data-line-id="${item.lineId}"
                            aria-label="Customer type for ${escapeHTML(item.name)}"
                        >

                            <option
                                value="General Customer"
                                ${item.customerType === "General Customer" ? "selected" : ""}
                            >
                                General Customer (0%)
                            </option>

                            <option
                                value="Student"
                                ${item.customerType === "Student" ? "selected" : ""}
                            >
                                Student (10%)
                            </option>

                            <option
                                value="Senior/PWD"
                                ${item.customerType === "Senior/PWD" ? "selected" : ""}
                            >
                                Senior/PWD (20%)
                            </option>

                        </select>

                        <small class="cart-line-discount">
                            ${discountRate}% discount ·
                            ${formatPrice(lineDiscount)} off
                        </small>

                    </div>

                    <div class="cart-item-actions">

                        <div class="quantity-controls">

                            <button
                                type="button"
                                class="quantity-btn decrease-quantity"
                                data-line-id="${item.lineId}"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>

                            <span>${item.quantity}</span>

                            <button
                                type="button"
                                class="quantity-btn increase-quantity"
                                data-line-id="${item.lineId}"
                                aria-label="Increase quantity"
                                ${item.quantity >= maxForThisLine ? "disabled" : ""}
                            >
                                +
                            </button>

                        </div>

                        <button
                            type="button"
                            class="remove-cart-item"
                            data-line-id="${item.lineId}"
                        >
                            <i class="fa-solid fa-trash"></i>
                            Remove
                        </button>

                    </div>

                </div>
            `;

        }).join("");
    }

    // ==========================================
    // 14. CART BUTTONS AND CUSTOMER TYPE
    // ==========================================

    if (cartItems) {

        cartItems.addEventListener("click", event => {

            const button = event.target.closest("button[data-line-id]");

            if (!button) return;

            const lineId = Number(button.dataset.lineId);

            const item = cart.find(
                cartItem => cartItem.lineId === lineId
            );

            if (!item) return;

            if (button.classList.contains("increase-quantity")) {

                const product = getProductById(item.id);

                if (!product) {

                    showMessage(
                        "Product Unavailable",
                        "This product is no longer available.",
                        "warning"
                    );

                    return;
                }

                const quantityInOtherLines =
                    getProductQuantityInCart(item.id) - item.quantity;

                if (
                    quantityInOtherLines + item.quantity >= product.stock
                ) {

                    showMessage(
                        "Insufficient Stock",
                        `Only ${product.stock} unit(s) of ${item.name} are available in total.`,
                        "warning"
                    );

                    return;
                }

                item.quantity++;

            } else if (
                button.classList.contains("decrease-quantity")
            ) {

                item.quantity--;

                if (item.quantity <= 0) {
                    cart = cart.filter(
                        cartItem => cartItem.lineId !== lineId
                    );
                }

            } else if (
                button.classList.contains("remove-cart-item")
            ) {

                cart = cart.filter(
                    cartItem => cartItem.lineId !== lineId
                );

            } else {
                return;
            }

            updateCart();
        });

        cartItems.addEventListener("change", event => {

            const customerSelect = event.target.closest(
                ".cart-customer-type[data-line-id]"
            );

            if (!customerSelect) return;

            const lineId = Number(customerSelect.dataset.lineId);

            const item = cart.find(
                cartItem => cartItem.lineId === lineId
            );

            if (
                !item ||
                !Object.prototype.hasOwnProperty.call(
                    DISCOUNTS,
                    customerSelect.value
                )
            ) {
                return;
            }

            item.customerType = customerSelect.value;

            updateCart();
        });
    }

    // ==========================================
    // 15. DISCOUNT CALCULATIONS
    // ==========================================

    function calculateOrder() {

        currentSubtotal = 0;
        currentDiscount = 0;

        cart.forEach(item => {

            const lineSubtotal = roundMoney(
                item.price * item.quantity
            );

            const discountRate = DISCOUNTS[item.customerType] ?? 0;

            const lineDiscount = roundMoney(
                lineSubtotal * discountRate / 100
            );

            currentSubtotal += lineSubtotal;
            currentDiscount += lineDiscount;
        });

        currentSubtotal = roundMoney(currentSubtotal);
        currentDiscount = roundMoney(currentDiscount);

        currentTotal = roundMoney(
            currentSubtotal - currentDiscount
        );
    }

    // ==========================================
    // 16. UPDATE CART AND ORDER SUMMARY
    // ==========================================

    function updateCart() {

        displayCart();

        calculateOrder();

        const totalQuantity = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        if (cartCount) {
            cartCount.textContent = totalQuantity;
        }

        if (subtotalValue) {
            subtotalValue.textContent = formatPrice(currentSubtotal);
        }

        if (discountValue) {
            discountValue.textContent = "-" + formatPrice(currentDiscount);
        }

        if (totalValue) {
            totalValue.textContent = formatPrice(currentTotal);
        }

        if (checkoutBtn) {
            checkoutBtn.disabled =
                cart.length === 0 || checkoutInProgress;
        }

        displayProducts();

        updatePaymentMethod();
    }

    // ==========================================
    // 17. PAYMENT AND CHANGE
    // ==========================================

    function updatePaymentMethod() {

        if (!paymentMethod) return;

        if (paymentMethod.value === "Cash") {

            if (cashPaymentGroup) {
                cashPaymentGroup.style.display = "block";
            }

            updateCashChange();

        } else {

            if (cashPaymentGroup) {
                cashPaymentGroup.style.display = "none";
            }

            if (cashReceived) {
                cashReceived.value = "";
            }

            if (changeRow) {
                changeRow.style.display = "none";
            }

            if (changeDue) {
                changeDue.textContent = formatPrice(0);
                changeDue.style.color = "";
            }
        }
    }

    function updateCashChange() {

        if (!cashReceived || !changeRow || !changeDue) return;

        if (cashReceived.value.trim() === "") {
            changeRow.style.display = "none";
            return;
        }

        const amount = Number(cashReceived.value);

        changeRow.style.display = "flex";

        if (
            !Number.isFinite(amount) ||
            amount < currentTotal ||
            amount < 0
        ) {

            changeDue.textContent = "Insufficient payment";
            changeDue.style.color = "#c94b43";

            return;
        }

        changeDue.textContent = formatPrice(
            amount - currentTotal
        );

        changeDue.style.color = "";
    }

    if (paymentMethod) {
        paymentMethod.addEventListener("change", updatePaymentMethod);
    }

    if (cashReceived) {
        cashReceived.addEventListener("input", updateCashChange);
    }

    // ==========================================
    // 18. CLEAR ORDER
    // ==========================================

    function clearCart() {

        cart = [];

        resetCustomerCount();

        if (cashReceived) {
            cashReceived.value = "";
        }

        updateCart();
    }

    if (clearCartBtn) {

        clearCartBtn.addEventListener("click", () => {

            if (cart.length === 0) {

                resetCustomerCount();

                if (cashReceived) {
                    cashReceived.value = "";
                }

                updateCart();

                return;
            }

            showConfirmation({

                title: "Clear Current Order?",

                message: "Are you sure you want to remove all products from the current order? This action cannot be undone.",

                confirmText: "Clear Order",

                cancelText: "Keep Order",

                icon: "fa-trash-can",

                danger: false,

                onConfirm: clearCart

            });
        });
    }

    // ==========================================
    // 19. CHECKOUT VALIDATION
    // ==========================================

    function validateCheckout() {

        if (cart.length === 0) {

            showMessage(
                "Empty Order",
                "Your cart is empty. Please add products first.",
                "warning"
            );

            return false;
        }

        const customerCount = customerCountInput
            ? Number(customerCountInput.value)
            : NaN;

        if (
            !customerCountInput ||
            customerCountInput.value.trim() === "" ||
            !Number.isInteger(customerCount) ||
            customerCount < 1
        ) {

            showMessage(
                "Invalid Customer Count",
                "Please enter a valid number of customers. The minimum is 1.",
                "warning",
                () => {
                    if (customerCountInput) {
                        customerCountInput.focus();
                    }
                }
            );

            return false;
        }

        for (const item of cart) {

            const product = getProductById(item.id);

            if (
                !product ||
                !Number.isInteger(item.quantity) ||
                item.quantity <= 0 ||
                !Object.prototype.hasOwnProperty.call(
                    DISCOUNTS,
                    item.customerType
                )
            ) {

                showMessage(
                    "Invalid Order Details",
                    `Please check the order details for ${item.name}.`,
                    "warning"
                );

                return false;
            }

            if (item.price !== product.price) {

                showMessage(
                    "Product Price Changed",
                    `The price of ${product.name} has changed. Please remove it from the order and add it again.`,
                    "warning"
                );

                return false;
            }
        }

        for (const product of products) {

            const requestedQuantity =
                getProductQuantityInCart(product.id);

            if (requestedQuantity > product.stock) {

                showMessage(
                    "Insufficient Stock",
                    `Insufficient stock for ${product.name}. Available: ${product.stock}.`,
                    "warning"
                );

                return false;
            }
        }

        if (!paymentMethod || !paymentMethod.value) {

            showMessage(
                "Payment Method Required",
                "Please select a payment method.",
                "warning"
            );

            return false;
        }

        if (paymentMethod.value === "Cash") {

            const amountReceived = cashReceived
                ? Number(cashReceived.value)
                : NaN;

            if (
                !cashReceived ||
                cashReceived.value.trim() === "" ||
                !Number.isFinite(amountReceived) ||
                amountReceived < currentTotal ||
                amountReceived < 0
            ) {

                showMessage(
                    "Insufficient Payment",
                    "The cash received is not enough to cover the total amount. Please enter sufficient payment.",
                    "warning",
                    () => {
                        if (cashReceived) {
                            cashReceived.focus();
                        }
                    }
                );

                return false;
            }
        }

        return true;
    }

    // ==========================================
    // 20. GENERATE RECEIPT
    // ==========================================

    function generateReceipt(transaction) {

        if (!receiptContent) return;

        const receiptItems = transaction.items.map(item => `

            <div class="receipt-item">

                <div>

                    <strong>${escapeHTML(item.name)}</strong>

                    <p>
                        ${item.quantity} × ${formatPrice(item.price)}
                    </p>

                    <small>
                        ${escapeHTML(item.customerType)}
                        · ${item.discountRate}% discount
                    </small>

                </div>

                <span>${formatPrice(item.lineTotal)}</span>

            </div>

        `).join("");

        const change =
            transaction.paymentMethod === "Cash"
                ? transaction.amountReceived - transaction.total
                : 0;

        receiptContent.innerHTML = `

            <div class="receipt-header">

                <h2>CaféSense</h2>

                <p>Café Sales and Customer Analytics</p>

                <p>Transaction Receipt</p>

            </div>

            <div class="receipt-details">

                <p>
                    <strong>Transaction ID:</strong>
                    ${escapeHTML(transaction.transactionId)}
                </p>

                <p>
                    <strong>Transaction Code:</strong>
                    ${escapeHTML(transaction.transactionCode)}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${escapeHTML(transaction.date)}
                </p>

                <p>
                    <strong>Number of Customers:</strong>
                    ${transaction.customerCount}
                </p>

            </div>

            <div class="receipt-items">

                <h3>Order Details</h3>

                ${receiptItems}

            </div>

            <div class="receipt-summary">

                <p>
                    <span>Subtotal</span>
                    <strong>${formatPrice(transaction.subtotal)}</strong>
                </p>

                <p>
                    <span>Total Discount</span>
                    <strong>-${formatPrice(transaction.discount)}</strong>
                </p>

                <p class="receipt-total">
                    <span>Total Amount</span>
                    <strong>${formatPrice(transaction.total)}</strong>
                </p>

                <p>
                    <span>Payment Method</span>
                    <strong>${escapeHTML(transaction.paymentMethod)}</strong>
                </p>

                ${
                    transaction.paymentMethod === "Cash"
                        ? `
                            <p>
                                <span>Cash Received</span>
                                <strong>${formatPrice(transaction.amountReceived)}</strong>
                            </p>

                            <p>
                                <span>Change</span>
                                <strong>${formatPrice(change)}</strong>
                            </p>
                        `
                        : ""
                }

            </div>

            <div class="receipt-footer">

                <p>Thank you for visiting CaféSense!</p>

                <span>Please come again.</span>

            </div>

        `;
    }

    // ==========================================
    // 21. SAVE INVENTORY AND TRANSACTIONS
    // ==========================================

    function saveCheckoutRecords(updatedProducts, transaction) {

        const previousProducts =
            localStorage.getItem(PRODUCTS_STORAGE_KEY);

        const previousTransactions =
            localStorage.getItem(TRANSACTIONS_STORAGE_KEY);

        try {

            localStorage.setItem(
                PRODUCTS_STORAGE_KEY,
                JSON.stringify(updatedProducts)
            );

            const updatedTransactions = [
                ...completedTransactions,
                transaction
            ];

            localStorage.setItem(
                TRANSACTIONS_STORAGE_KEY,
                JSON.stringify(updatedTransactions)
            );

            products = updatedProducts;
            completedTransactions = updatedTransactions;

            return true;

        } catch (error) {

            console.error(
                "Unable to save checkout records:",
                error
            );

            try {

                if (previousProducts === null) {
                    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
                } else {
                    localStorage.setItem(
                        PRODUCTS_STORAGE_KEY,
                        previousProducts
                    );
                }

                if (previousTransactions === null) {
                    localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
                } else {
                    localStorage.setItem(
                        TRANSACTIONS_STORAGE_KEY,
                        previousTransactions
                    );
                }

            } catch (restoreError) {

                console.error(
                    "Unable to restore previous records:",
                    restoreError
                );
            }

            return false;
        }
    }

    // ==========================================
    // CUSTOMER COUNT CONFIRMATION
    // ==========================================

    function confirmCustomerCountBeforeCheckout() {

        if (checkoutInProgress) return;

        calculateOrder();

        if (!validateCheckout()) return;

        const customerCount = Number(customerCountInput.value);

        showConfirmation({

            title: "Confirm Customer Count",

            message:
                `You entered ${customerCount} customer(s) for this transaction. ` +
                "Please make sure this matches the actual number of customers before proceeding.",

            confirmText: "Confirm & Continue",

            cancelText: "Go Back / Edit Count",

            icon: "fa-users",

            danger: false,

            onConfirm: completeCheckout

        });
    }

    // ==========================================
    // 22. COMPLETE TRANSACTION
    // ==========================================

    async function completeCheckout() {

        if (checkoutInProgress) return;

        calculateOrder();

        if (!validateCheckout()) return;

        checkoutInProgress = true;

        if (checkoutBtn) {
            checkoutBtn.disabled = true;
        }

        try {

            const selectedPayment = paymentMethod.value;

            const amountReceived =
                selectedPayment === "Cash"
                    ? Number(cashReceived.value)
                    : currentTotal;

            const customerCount = Number(
                customerCountInput.value
            );

            const transactionData = {

                paymentMethod: selectedPayment,

                customerCount: customerCount,

                amountReceived: amountReceived,

                items: cart.map(item => ({
                    productId: Number(item.id),
                    quantity: Number(item.quantity),
                    customerType: item.customerType
                }))

            };

            const response = await transactionApi.create(
                transactionData
            );

            const transaction = response.data;

            if (!transaction || !transaction.transactionId) {
                throw new Error(
                    "Invalid transaction response from the server."
                );
            }

            completedTransactions.unshift(transaction);

            generateReceipt(transaction);

            if (receiptModal) {
                receiptModal.style.display = "flex";
                receiptModal.classList.add("active");
                receiptModal.setAttribute("aria-hidden", "false");
            }

            cart = [];

            resetCustomerCount();

            if (cashReceived) {
                cashReceived.value = "";
            }

            if (paymentMethod) {
                paymentMethod.value = "Cash";
            }

            updateCart();
            updatePaymentMethod();

            console.log(
                "Completed database transaction:",
                transaction
            );

            try {

                await refreshProducts();

            } catch (refreshError) {

                console.error(
                    "Transaction succeeded, but inventory refresh failed:",
                    refreshError
                );

                showMessage(
                    "Transaction Completed",
                    "Your transaction was saved, but the inventory display could not be refreshed. Please reload the page.",
                    "warning"
                );
            }

        } catch (error) {

            console.error("Checkout error:", error);

            showMessage(
                "Transaction Failed",
                error.message || "The transaction could not be completed. Please try again.",
                "error"
            );

        } finally {

            checkoutInProgress = false;

            updateCart();

        }
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener(
            "click",
            confirmCustomerCountBeforeCheckout
        );
    }

    // ==========================================
    // 23. CLOSE RECEIPT
    // ==========================================

    function closeReceipt() {

        if (!receiptModal) return;

        receiptModal.style.display = "none";

        receiptModal.classList.remove("active");

        receiptModal.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    if (closeReceiptBtn) {
        closeReceiptBtn.addEventListener("click", closeReceipt);
    }

    if (receiptModal) {

        receiptModal.addEventListener("click", event => {

            if (event.target === receiptModal) {
                closeReceipt();
            }
        });
    }

    // ==========================================
    // 24. PRINT RECEIPT
    // ==========================================

    if (printReceiptBtn) {

        printReceiptBtn.addEventListener("click", () => {

            if (
                !receiptContent ||
                !receiptContent.innerHTML.trim()
            ) {

                showMessage(
                    "No Receipt Available",
                    "There is no receipt to print. Complete a transaction first.",
                    "warning"
                );

                return;
            }

            showConfirmation({

                title: "Print Receipt?",

                message: "Would you like to print this transaction receipt?",

                confirmText: "Print Receipt",

                cancelText: "Cancel",

                icon: "fa-print",

                danger: false,

                onConfirm: () => {

                    const printWindow = window.open(
                        "",
                        "_blank",
                        "width=500,height=700"
                    );

                    if (!printWindow) {

                        showMessage(
                            "Print Window Blocked",
                            "The print window was blocked. Allow pop-ups for this page, then try again.",
                            "warning"
                        );

                        return;
                    }

                    const printDocument = `

                        <!DOCTYPE html>

                        <html lang="en">

                        <head>

                            <meta charset="UTF-8">

                            <meta name="viewport" content="width=device-width, initial-scale=1.0">

                            <title>CaféSense Receipt</title>

                            <style>

                                * {
                                    box-sizing: border-box;
                                }

                                body {
                                    font-family: Arial, sans-serif;
                                    width: 80mm;
                                    margin: 0 auto;
                                    padding: 12px;
                                    color: #222;
                                    font-size: 12px;
                                }

                                h2, h3, p {
                                    margin-top: 5px;
                                    margin-bottom: 8px;
                                }

                                .receipt-header,
                                .receipt-footer {
                                    text-align: center;
                                    margin-bottom: 16px;
                                }

                                .receipt-header h2 {
                                    font-size: 21px;
                                }

                                .receipt-details,
                                .receipt-items,
                                .receipt-summary {
                                    border-bottom: 1px dashed #888;
                                    padding: 10px 0;
                                }

                                .receipt-details p {
                                    overflow-wrap: anywhere;
                                }

                                .receipt-item,
                                .receipt-summary p {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: flex-start;
                                    gap: 10px;
                                }

                                .receipt-item {
                                    margin: 10px 0;
                                }

                                .receipt-item p,
                                .receipt-item small {
                                    font-size: 11px;
                                }

                                .receipt-total {
                                    border-top: 1px solid #333;
                                    padding-top: 9px;
                                    font-size: 15px;
                                    font-weight: bold;
                                }

                                .receipt-footer {
                                    margin-top: 18px;
                                }

                                @page {
                                    size: auto;
                                    margin: 8mm;
                                }

                                @media print {
                                    body {
                                        width: auto;
                                        margin: 0;
                                        padding: 0;
                                    }
                                }

                            </style>

                        </head>

                        <body>

                            ${receiptContent.innerHTML}

                        </body>

                        </html>

                    `;

                    printWindow.document.open();

                    printWindow.document.write(printDocument);

                    printWindow.document.close();

                    let printStarted = false;

                    const startPrinting = () => {

                        if (printStarted || printWindow.closed) return;

                        printStarted = true;

                        printWindow.focus();

                        printWindow.print();
                    };

                    printWindow.addEventListener(
                        "load",
                        () => setTimeout(startPrinting, 150),
                        { once: true }
                    );

                    setTimeout(startPrinting, 700);

                    printWindow.addEventListener(
                        "afterprint",
                        () => printWindow.close(),
                        { once: true }
                    );
                }
            });
        });
    }

    // ==========================================
    // 25. SIDEBAR - DASHBOARD-MATCHING BEHAVIOR
    // ==========================================

    const mobileBreakpoint = window.matchMedia("(max-width: 850px)");

    function isMobileView() {
        return mobileBreakpoint.matches;
    }

    function updateDesktopToggleState() {

        if (!sidebarToggle || !sidebar) return;

        const isCollapsed = sidebar.classList.contains("collapsed");

        sidebarToggle.setAttribute(
            "aria-expanded",
            String(!isCollapsed)
        );

        sidebarToggle.setAttribute(
            "title",
            isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"
        );

        sidebarToggle.setAttribute(
            "aria-label",
            isCollapsed ? "Expand sidebar" : "Collapse sidebar"
        );
    }

    function updateMobileToggleState(isOpen) {

        if (!mobileSidebarToggle) return;

        mobileSidebarToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        mobileSidebarToggle.setAttribute(
            "title",
            isOpen ? "Close Navigation" : "Open Navigation"
        );

        mobileSidebarToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );
    }

    function applyDesktopSidebarState() {

        if (!sidebar) return;

        const isCollapsed =
            localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";

        sidebar.classList.remove("mobile-open");

        sidebar.classList.toggle("collapsed", isCollapsed);

        document.body.classList.remove("sidebar-overlay-active");

        updateDesktopToggleState();

        updateMobileToggleState(false);
    }

    function openMobileSidebar() {

        if (!sidebar || !isMobileView()) return;

        sidebar.classList.add("mobile-open");

        document.body.classList.add("sidebar-overlay-active");

        updateMobileToggleState(true);
    }

    function closeMobileSidebar() {

        if (!sidebar) return;

        sidebar.classList.remove("mobile-open");

        document.body.classList.remove("sidebar-overlay-active");

        updateMobileToggleState(false);
    }

    // ------------------------------------------
    // DESKTOP SIDEBAR COLLAPSE / EXPAND
    // ------------------------------------------

    if (sidebarToggle && sidebar) {

        sidebarToggle.addEventListener("click", () => {

            if (isMobileView()) return;

            const isCurrentlyCollapsed =
                sidebar.classList.contains("collapsed");

            const shouldCollapse = !isCurrentlyCollapsed;

            sidebar.classList.toggle(
                "collapsed",
                shouldCollapse
            );

            try {

                localStorage.setItem(
                    SIDEBAR_STORAGE_KEY,
                    String(shouldCollapse)
                );

            } catch (error) {

                console.error(
                    "Unable to save sidebar preference:",
                    error
                );
            }

            updateDesktopToggleState();
        });
    }

    // ------------------------------------------
    // MOBILE SIDEBAR OPEN / CLOSE
    // ------------------------------------------

    if (mobileSidebarToggle && sidebar) {

        mobileSidebarToggle.addEventListener("click", () => {

            if (!isMobileView()) return;

            const isCurrentlyOpen =
                sidebar.classList.contains("mobile-open");

            if (isCurrentlyOpen) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        });
    }

    // ------------------------------------------
    // MOBILE SIDEBAR CLOSE BUTTON
    // ------------------------------------------

    if (sidebarClose && sidebar) {

        sidebarClose.addEventListener("click", () => {

            if (!isMobileView()) return;

            closeMobileSidebar();
        });
    }

    // ------------------------------------------
    // ANALYTICS DROPDOWN
    // ------------------------------------------

    function setAnalyticsDropdown(isOpen) {

        if (!analyticsDropdownToggle || !analyticsNavList) return;

        analyticsDropdownToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        analyticsNavList.classList.toggle(
            "collapsed",
            !isOpen
        );
    }

    if (analyticsDropdownToggle && analyticsNavList) {

        analyticsDropdownToggle.addEventListener("click", () => {

            const isCurrentlyOpen =
                analyticsDropdownToggle.getAttribute("aria-expanded") === "true";

            setAnalyticsDropdown(!isCurrentlyOpen);
        });
    }

    // ------------------------------------------
    // CLOSE SIDEBAR AFTER NAVIGATION ON MOBILE
    // ------------------------------------------

    if (sidebar) {

        sidebar.querySelectorAll(".sidebar-nav a").forEach(link => {

            link.addEventListener("click", () => {

                if (isMobileView()) {
                    closeMobileSidebar();
                }
            });
        });
    }

    // ------------------------------------------
    // CLOSE SIDEBAR WHEN CLICKING OUTSIDE
    // ------------------------------------------

    document.addEventListener("click", event => {

        if (
            !sidebar ||
            !isMobileView() ||
            !sidebar.classList.contains("mobile-open")
        ) {
            return;
        }

        const clickedInsideSidebar = sidebar.contains(event.target);

        const clickedMobileToggle =
            mobileSidebarToggle &&
            mobileSidebarToggle.contains(event.target);

        if (!clickedInsideSidebar && !clickedMobileToggle) {
            closeMobileSidebar();
        }
    });

    // ------------------------------------------
    // ESCAPE KEY
    // ------------------------------------------

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        if (
            isMobileView() &&
            sidebar &&
            sidebar.classList.contains("mobile-open")
        ) {
            closeMobileSidebar();
        }

        if (
            receiptModal &&
            receiptModal.classList.contains("active")
        ) {
            closeReceipt();
        }
    });

    // ------------------------------------------
    // RESPONSIVE SIDEBAR BEHAVIOR
    // ------------------------------------------

    function handleSidebarResize() {

        if (!sidebar) return;

        if (isMobileView()) {

            sidebar.classList.remove("collapsed");

            closeMobileSidebar();

        } else {

            applyDesktopSidebarState();
        }
    }

    if (mobileBreakpoint.addEventListener) {

        mobileBreakpoint.addEventListener(
            "change",
            handleSidebarResize
        );

    } else {

        mobileBreakpoint.addListener(handleSidebarResize);
    }

    handleSidebarResize();

    // ==========================================
    // 26. LOGOUT - DASHBOARD-MATCHING MODAL
    // ==========================================

    function setupLogout() {

        if (!logoutBtn) return;

        let logoutModal = null;

        function closeLogoutModal() {

            if (!logoutModal) return;

            logoutModal.classList.remove("show");

            document.body.classList.remove("logout-modal-open");

            document.removeEventListener(
                "keydown",
                handleLogoutModalKeydown
            );

            const modalToRemove = logoutModal;

            logoutModal = null;

            setTimeout(() => {
                modalToRemove.remove();
                logoutBtn.focus();
            }, 200);
        }

        function handleLogoutModalKeydown(event) {

            if (!logoutModal) return;

            if (event.key === "Escape") {

                event.preventDefault();

                closeLogoutModal();

                return;
            }

            if (event.key === "Tab") {

                const cancelButton = logoutModal.querySelector(
                    "#logout-modal-cancel"
                );

                const confirmButton = logoutModal.querySelector(
                    "#logout-modal-confirm"
                );

                if (
                    event.shiftKey &&
                    document.activeElement === cancelButton
                ) {
                    event.preventDefault();
                    confirmButton.focus();

                } else if (
                    !event.shiftKey &&
                    document.activeElement === confirmButton
                ) {
                    event.preventDefault();
                    cancelButton.focus();
                }
            }
        }

        function openLogoutModal() {

            if (logoutModal) return;

            logoutModal = document.createElement("div");

            logoutModal.className = "logout-modal-overlay";

            logoutModal.innerHTML = `

                <section
                    class="logout-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="logout-modal-title"
                    aria-describedby="logout-modal-description"
                    tabindex="-1"
                >

                    <div class="logout-modal-icon">
                        <i class="fa-solid fa-right-from-bracket"></i>
                    </div>

                    <span class="logout-modal-eyebrow">
                        CAFÉSENSE ACCOUNT
                    </span>

                    <h2 id="logout-modal-title">
                        Confirm Logout
                    </h2>

                    <p id="logout-modal-description">
                        Are you sure you want to log out of your CaféSense account?
                    </p>

                    <div class="logout-modal-actions">

                        <button
                            type="button"
                            class="logout-modal-cancel"
                            id="logout-modal-cancel"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            class="logout-modal-confirm"
                            id="logout-modal-confirm"
                        >
                            <i class="fa-solid fa-right-from-bracket"></i>
                            Yes, Logout
                        </button>

                    </div>

                </section>

            `;

            document.body.appendChild(logoutModal);

            const cancelButton = logoutModal.querySelector(
                "#logout-modal-cancel"
            );

            const confirmButton = logoutModal.querySelector(
                "#logout-modal-confirm"
            );

            cancelButton.addEventListener(
                "click",
                closeLogoutModal
            );

            // CONFIRM LOGOUT

            confirmButton.addEventListener("click", async function () {

                try {

                    confirmButton.disabled = true;

                    confirmButton.innerHTML = `
                        <i class="fa-solid fa-spinner fa-spin"></i>
                        Logging out...
                    `;

                    await apiClient.post("/auth/logout", {});

                    sessionStorage.clear();

                    window.location.href = "./login.html";

                } catch (error) {

                    console.error("Logout failed:", error);

                    confirmButton.disabled = false;

                    confirmButton.innerHTML = `
                        <i class="fa-solid fa-right-from-bracket"></i>
                        Yes, Logout
                    `;

                    showMessage(
                        "Logout Error",
                        "Unable to log out. Please check your connection and try again.",
                        "error"
                    );
                }

            });

            logoutModal.addEventListener("click", event => {

                if (event.target === logoutModal) {
                    closeLogoutModal();
                }
            });

            document.addEventListener(
                "keydown",
                handleLogoutModalKeydown
            );

            document.body.classList.add("logout-modal-open");

            requestAnimationFrame(() => {

                logoutModal.classList.add("show");

                cancelButton.focus();
            });
        }

        logoutBtn.addEventListener("click", event => {

            event.preventDefault();

            openLogoutModal();
        });
    }

    setupLogout();

    // ==========================================
    // 27. CURRENT DATE AND TIME
    // ==========================================

    function updateCurrentDateTime() {

        const now = new Date();

        if (currentDateElement) {

            currentDateElement.textContent =
                now.toLocaleDateString("en-PH", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }).toUpperCase();
        }

        if (currentTimeElement) {

            currentTimeElement.textContent =
                now.toLocaleTimeString("en-PH", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                });
        }
    }

    updateCurrentDateTime();

    window.setInterval(updateCurrentDateTime, 1000);

    // ==========================================
    // 28. INITIALIZE POS
    // ==========================================

    resetCustomerCount();

    displayProducts();

    updateCart();

    updatePaymentMethod();

    if (inventoryLoadError) {

        showMessage(
            "Inventory Loading Error",
            "The inventory data could not be loaded. Please check your Inventory & Menu records.",
            "error"
        );
    }

    console.log(
        "CaféSense Transaction POS is ready!"
    );

});
