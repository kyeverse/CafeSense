
/* =========================================================
   CAFÉSENSE - PRODUCTS & INVENTORY
========================================================= */


/* =========================================================
   1. PRODUCT DATA
========================================================= */

import { productApi } from "../api/productApi.js";
import { apiClient } from "../api/apiClient.js";
import { getProductImageUrl } from "../utils/productImage.js";

const LOW_STOCK_LIMIT = 10;
const SIDEBAR_STORAGE_KEY = "cafeSenseSidebarCollapsed";

let products = [];
let inventoryMovements = [];
let currentUser = null;
let isReadOnlyUser = false;


/* =========================================================
   2. LOAD PRODUCTS FROM THE API
========================================================= */

async function loadProducts() {

    const response = await productApi.getAll();

    if (!response.success || !Array.isArray(response.data)) {
        throw new Error("The server returned an invalid product list.");
    }

    products = response.data.map(function (product) {

        return {
            id: String(product.id),
            name: String(product.name || ""),
            category: String(product.category || ""),
            price: Number(product.price),
            stock: Number(product.stock),
            status: product.status || "Available"
        };

    });

    updateInventorySummary();
    displayProducts();

    return products;

}


function formatProductID(id) {
    return "P" + String(id).padStart(3, "0");
}


/* =========================================================
   3. CUSTOM ALERT AND CONFIRMATION DIALOGS
========================================================= */

let activeAppDialog = null;


function showAppDialog(options) {

    if (activeAppDialog) {
        return Promise.resolve(false);
    }

    return new Promise(function (resolve) {

        const settings = {
            type: options.type || "alert",
            title: options.title || "Notice",
            message: options.message || "",
            icon: options.icon || "fa-circle-info",
            tone: options.tone || "default",
            confirmText: options.confirmText || "Okay",
            cancelText: options.cancelText || "Cancel",
            details: options.details || []
        };

        const overlay = document.createElement("div");
        overlay.className = "app-dialog-overlay";

        const dialog = document.createElement("section");
        dialog.className = "app-dialog";

        dialog.setAttribute(
            "role",
            settings.type === "confirm" ? "alertdialog" : "dialog"
        );

        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("aria-labelledby", "app-dialog-title");
        dialog.setAttribute("aria-describedby", "app-dialog-message");
        dialog.setAttribute("tabindex", "-1");


        const iconContainer = document.createElement("div");
        iconContainer.className = "app-dialog-icon";

        if (settings.tone !== "default") {
            iconContainer.classList.add(settings.tone);
        }

        const icon = document.createElement("i");
        icon.className = `fa-solid ${settings.icon}`;

        iconContainer.appendChild(icon);


        const eyebrow = document.createElement("span");
        eyebrow.className = "app-dialog-eyebrow";
        eyebrow.textContent = "CAFÉSENSE INVENTORY";


        const title = document.createElement("h2");
        title.id = "app-dialog-title";
        title.textContent = settings.title;


        const message = document.createElement("p");
        message.id = "app-dialog-message";
        message.className = "app-dialog-message";
        message.textContent = settings.message;


        dialog.appendChild(iconContainer);
        dialog.appendChild(eyebrow);
        dialog.appendChild(title);
        dialog.appendChild(message);


        if (settings.details.length > 0) {

            const detailsContainer = document.createElement("div");
            detailsContainer.className = "app-dialog-details";

            settings.details.forEach(function (detail) {

                const detailRow = document.createElement("div");
                detailRow.className = "app-dialog-detail";

                const label = document.createElement("span");
                label.textContent = detail.label;

                const value = document.createElement("strong");
                value.textContent = detail.value;

                detailRow.appendChild(label);
                detailRow.appendChild(value);

                detailsContainer.appendChild(detailRow);

            });

            dialog.appendChild(detailsContainer);

        }


        const actions = document.createElement("div");
        actions.className = "app-dialog-actions";

        let cancelButton = null;

        if (settings.type === "confirm") {

            cancelButton = document.createElement("button");
            cancelButton.type = "button";
            cancelButton.className = "app-dialog-btn cancel";
            cancelButton.textContent = settings.cancelText;

            actions.appendChild(cancelButton);

        }


        const confirmButton = document.createElement("button");
        confirmButton.type = "button";
        confirmButton.className = "app-dialog-btn confirm";

        if (settings.tone === "danger") {
            confirmButton.classList.add("danger");
        }

        confirmButton.textContent = settings.confirmText;

        actions.appendChild(confirmButton);

        dialog.appendChild(actions);
        overlay.appendChild(dialog);

        document.body.appendChild(overlay);

        activeAppDialog = overlay;

        document.body.classList.add("app-dialog-open");


        let isClosing = false;


        function closeDialog(result) {

            if (isClosing) {
                return;
            }

            isClosing = true;

            overlay.classList.remove("show");

            document.body.classList.remove("app-dialog-open");

            document.removeEventListener(
                "keydown",
                handleDialogKeydown
            );

            activeAppDialog = null;

            setTimeout(function () {
                overlay.remove();
            }, 230);

            resolve(result);

        }


        function handleDialogKeydown(event) {

            if (event.key === "Escape") {

                event.preventDefault();
                event.stopImmediatePropagation();

                closeDialog(false);

                return;

            }

            if (event.key === "Tab") {

                const focusableElements = dialog.querySelectorAll(
                    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );

                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (!firstElement || !lastElement) {
                    event.preventDefault();
                    return;
                }

                if (event.shiftKey && document.activeElement === firstElement) {

                    event.preventDefault();
                    lastElement.focus();

                } else if (!event.shiftKey && document.activeElement === lastElement) {

                    event.preventDefault();
                    firstElement.focus();

                }

            }

        }


        if (cancelButton) {

            cancelButton.addEventListener("click", function () {
                closeDialog(false);
            });

        }


        confirmButton.addEventListener("click", function () {
            closeDialog(true);
        });


        overlay.addEventListener("click", function (event) {

            if (event.target === overlay) {
                closeDialog(false);
            }

        });


        document.addEventListener(
            "keydown",
            handleDialogKeydown
        );


        requestAnimationFrame(function () {

            overlay.classList.add("show");

            if (cancelButton) {
                cancelButton.focus();
            } else {
                confirmButton.focus();
            }

        });

    });

}


/* =========================================================
   4. GET HTML ELEMENTS
========================================================= */

// Sidebar
const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const mobileSidebarToggle = document.getElementById("mobileSidebarToggle");
const sidebarClose = document.getElementById("sidebarClose");
const sidebarOverlay = document.getElementById("sidebarOverlay");

// Analytics dropdown
const analyticsDropdownToggle = document.getElementById("analyticsDropdownToggle");
const analyticsNavList = document.getElementById("analyticsNavList");

// Header date time
const currentDateElement = document.getElementById("current-date");
const currentTimeElement = document.getElementById("current-time");

// Summary cards
const totalProducts = document.getElementById("totalProducts");
const inStockProducts = document.getElementById("inStockProducts");
const lowStockProducts = document.getElementById("lowStockProducts");
const outOfStockProducts = document.getElementById("outOfStockProducts");
const displayProductCount = document.getElementById("displayProductCount");

// Search and filters
const productSearch = document.getElementById("productSearch");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const categoryFilter = document.getElementById("categoryFilter");
const stockFilter = document.getElementById("stockFilter");

// Product table
const productTableBody = document.getElementById("productTableBody");
const emptyInventory = document.getElementById("emptyInventory");

// Product modal
const productModal = document.getElementById("productModal");
const addProductBtn = document.getElementById("addProductBtn");
const cancelProductBtn = document.getElementById("cancelProductBtn");

const productForm = document.getElementById("productForm");
const modalTitle = document.getElementById("modalTitle");

const editProductId = document.getElementById("editProductId");
const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productPrice = document.getElementById("productPrice");
const productStock = document.getElementById("productStock");

// Stock modal
const stockModal = document.getElementById("stockModal");
const cancelStockBtn = document.getElementById("cancelStockBtn");
const stockForm = document.getElementById("stockForm");

const stockProductId = document.getElementById("stockProductId");
const stockProductName = document.getElementById("stockProductName");
const currentStockValue = document.getElementById("currentStockValue");

const stockAction = document.getElementById("stockAction");
const stockQuantity = document.getElementById("stockQuantity");
const stockReason = document.getElementById("stockReason");

// Inventory Movement History
const movementProductFilter = document.getElementById("movementProductFilter");
const refreshMovementHistoryBtn = document.getElementById("refreshMovementHistoryBtn");

const movementCount = document.getElementById("movementCount");
const movementHistoryTableBody = document.getElementById("movementHistoryTableBody");
const emptyMovementHistory = document.getElementById("emptyMovementHistory");


/* =========================================================
   5. STOCK FILTER SETUP
========================================================= */

function setupStockFilter() {

    if (!stockFilter) {
        return;
    }

    const unavailableOption = Array.from(stockFilter.options).find(
        function (option) {
            return option.value === "Unavailable";
        }
    );

    if (!unavailableOption) {

        const option = document.createElement("option");

        option.value = "Unavailable";
        option.textContent = "Unavailable";

        stockFilter.appendChild(option);

    }

}


/* =========================================================
   6. SIDEBAR RESPONSIVE BEHAVIOR
========================================================= */

const MOBILE_BREAKPOINT = 850;

const mobileMediaQuery = window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT}px)`
);


function isMobileView() {
    return mobileMediaQuery.matches;
}


function updateSidebarAccessibility() {

    if (!sidebar) {
        return;
    }

    const isMobile = isMobileView();

    const isExpanded = isMobile
        ? sidebar.classList.contains("mobile-open")
        : !sidebar.classList.contains("collapsed");


    if (sidebarToggle) {

        sidebarToggle.setAttribute(
            "aria-expanded",
            String(!sidebar.classList.contains("collapsed"))
        );

        sidebarToggle.setAttribute(
            "aria-label",
            sidebar.classList.contains("collapsed")
                ? "Expand sidebar"
                : "Collapse sidebar"
        );

        sidebarToggle.setAttribute(
            "title",
            sidebar.classList.contains("collapsed")
                ? "Expand Sidebar"
                : "Collapse Sidebar"
        );

    }


    if (mobileSidebarToggle) {

        mobileSidebarToggle.setAttribute(
            "aria-expanded",
            String(isExpanded)
        );

        mobileSidebarToggle.setAttribute(
            "aria-label",
            isExpanded ? "Close navigation" : "Open navigation"
        );

        mobileSidebarToggle.setAttribute(
            "title",
            isExpanded ? "Close Navigation" : "Open Navigation"
        );

    }

}


function openMobileSidebar() {

    if (!sidebar || !isMobileView()) {
        return;
    }

    sidebar.classList.remove("collapsed");
    sidebar.classList.add("mobile-open");

    document.body.classList.add("sidebar-overlay-active");

    if (sidebarOverlay) {
        sidebarOverlay.classList.add("active");
    }

    updateSidebarAccessibility();

}


function closeMobileSidebar() {

    if (!sidebar) {
        return;
    }

    sidebar.classList.remove("mobile-open");

    document.body.classList.remove("sidebar-overlay-active");

    if (sidebarOverlay) {
        sidebarOverlay.classList.remove("active");
    }

    updateSidebarAccessibility();

}


function applySidebarState() {

    if (!sidebar) {
        return;
    }

    if (isMobileView()) {

        sidebar.classList.remove("collapsed");
        sidebar.classList.remove("mobile-open");

        document.body.classList.remove("sidebar-overlay-active");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

    } else {

        const isCollapsed =
            localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";

        sidebar.classList.remove("mobile-open");

        sidebar.classList.toggle(
            "collapsed",
            isCollapsed
        );

        document.body.classList.remove("sidebar-overlay-active");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("active");
        }

    }

    updateSidebarAccessibility();

}


if (sidebarToggle && sidebar) {

    sidebarToggle.addEventListener("click", function () {

        if (isMobileView()) {
            return;
        }

        sidebar.classList.toggle("collapsed");

        const isCollapsed =
            sidebar.classList.contains("collapsed");

        localStorage.setItem(
            SIDEBAR_STORAGE_KEY,
            String(isCollapsed)
        );

        updateSidebarAccessibility();

    });

}


if (mobileSidebarToggle) {

    mobileSidebarToggle.addEventListener("click", function () {

        if (!isMobileView()) {
            return;
        }

        if (sidebar && sidebar.classList.contains("mobile-open")) {
            closeMobileSidebar();
        } else {
            openMobileSidebar();
        }

    });

}


if (sidebarClose) {

    sidebarClose.addEventListener("click", function () {

        if (isMobileView()) {
            closeMobileSidebar();
        }

    });

}


if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeMobileSidebar
    );

}


document.addEventListener("click", function (event) {

    if (!isMobileView() || !sidebar) {
        return;
    }

    if (!sidebar.classList.contains("mobile-open")) {
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


if (sidebar) {

    const sidebarLinks = sidebar.querySelectorAll("a[href]");

    sidebarLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (isMobileView()) {
                closeMobileSidebar();
            }

        });

    });

}


window.addEventListener("resize", function () {
    applySidebarState();
});


applySidebarState();


/* =========================================================
   7. ANALYTICS DROPDOWN
========================================================= */

function setupAnalyticsDropdown() {

    if (!analyticsDropdownToggle || !analyticsNavList) {
        return;
    }

    analyticsDropdownToggle.addEventListener("click", function () {

        const isCurrentlyExpanded =
            analyticsDropdownToggle.getAttribute("aria-expanded") === "true";

        const shouldExpand = !isCurrentlyExpanded;

        analyticsDropdownToggle.setAttribute(
            "aria-expanded",
            String(shouldExpand)
        );

        analyticsNavList.classList.toggle(
            "collapsed",
            !shouldExpand
        );

    });

}

setupAnalyticsDropdown();


/* =========================================================
   8. DISPLAY CURRENT DATE AND TIME
========================================================= */

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


/* =========================================================
   9. GET PRODUCT STOCK STATUS
========================================================= */

function getStockStatus(stock) {

    if (stock === 0) {
        return "Out of Stock";
    }

    if (stock <= LOW_STOCK_LIMIT) {
        return "Low Stock";
    }

    return "In Stock";

}


/* =========================================================
   10. UPDATE INVENTORY SUMMARY
========================================================= */

function updateInventorySummary() {

    const total = products.length;

    const inStock = products.filter(function (product) {
        return product.status !== "Unavailable" &&
            getStockStatus(product.stock) === "In Stock";
    }).length;

    const lowStock = products.filter(function (product) {
        return product.status !== "Unavailable" &&
            getStockStatus(product.stock) === "Low Stock";
    }).length;

    const outOfStock = products.filter(function (product) {
        return product.status !== "Unavailable" &&
            getStockStatus(product.stock) === "Out of Stock";
    }).length;


    if (totalProducts) {
        totalProducts.textContent = total;
    }

    if (inStockProducts) {
        inStockProducts.textContent = inStock;
    }

    if (lowStockProducts) {
        lowStockProducts.textContent = lowStock;
    }

    if (outOfStockProducts) {
        outOfStockProducts.textContent = outOfStock;
    }

}


/* =========================================================
   11. DISPLAY PRODUCTS
========================================================= */

function displayProducts() {

    if (!productTableBody) {
        return;
    }

    productTableBody.innerHTML = "";

    const searchValue = productSearch
        ? productSearch.value.trim().toLowerCase()
        : "";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "all";

    const selectedStock = stockFilter
        ? stockFilter.value
        : "all";


    const filteredProducts = products.filter(function (product) {

        const matchesSearch =
            product.name.toLowerCase().includes(searchValue) ||
            product.id.toLowerCase().includes(searchValue);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const stockStatus = product.status === "Unavailable"
            ? "Unavailable"
            : getStockStatus(product.stock);

        const matchesStock =
            selectedStock === "all" ||
            stockStatus === selectedStock;

        return matchesSearch && matchesCategory && matchesStock;

    });


    if (displayProductCount) {
        displayProductCount.textContent = filteredProducts.length;
    }


    if (filteredProducts.length === 0) {

        if (emptyInventory) {
            emptyInventory.style.display = "block";
        }

        return;

    }

    if (emptyInventory) {
        emptyInventory.style.display = "none";
    }


    filteredProducts.forEach(function (product) {

        const isUnavailable = product.status === "Unavailable";

        const status = isUnavailable
            ? "Unavailable"
            : getStockStatus(product.stock);

        let statusClass = "";

        if (isUnavailable) {
            statusClass = "out-of-stock";
        } else if (status === "In Stock") {
            statusClass = "in-stock";
        } else if (status === "Low Stock") {
            statusClass = "low-stock";
        } else {
            statusClass = "out-of-stock";
        }


        // STAFF CAN VIEW PRODUCTS BUT CANNOT MANAGE THEM.
        const actionButtons = isReadOnlyUser
            ? ""
            : `
                <button
                    type="button"
                    class="action-btn edit-btn"
                    data-action="edit"
                    data-id="${escapeHTML(product.id)}"
                    title="Edit Product"
                    aria-label="Edit ${escapeHTML(product.name)}">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    type="button"
                    class="action-btn stock-btn"
                    data-action="stock"
                    data-id="${escapeHTML(product.id)}"
                    title="Adjust Stock"
                    aria-label="Adjust stock for ${escapeHTML(product.name)}">
                    <i class="fa-solid fa-boxes-stacked"></i>
                </button>

                <button
                    type="button"
                    class="action-btn ${isUnavailable ? "edit-btn" : "delete-btn"}"
                    data-action="${isUnavailable ? "activate" : "delete"}"
                    data-id="${escapeHTML(product.id)}"
                    title="${isUnavailable ? "Reactivate Product" : "Deactivate Product"}"
                    aria-label="${isUnavailable ? "Reactivate" : "Deactivate"} ${escapeHTML(product.name)}">
                    <i class="fa-solid ${isUnavailable ? "fa-rotate-left" : "fa-ban"}"></i>
                </button>
            `;


        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                <span class="product-id">
                    ${escapeHTML(formatProductID(product.id))}
                </span>
            </td>

            <td>
                <div class="product-name-cell">
                    <img class="product-table-thumb" src="${getProductImageUrl(product)}" alt="${escapeHTML(product.name)}" loading="lazy">
                    <span class="product-name">
                        ${escapeHTML(product.name)}
                    </span>
                </div>
            </td>

            <td>
                <span class="category-badge">
                    ${escapeHTML(product.category)}
                </span>
            </td>

            <td>
                <span class="product-price">
                    ₱${Number(product.price).toFixed(2)}
                </span>
            </td>

            <td>
                <span class="product-stock">
                    ${product.stock}
                </span>
            </td>

            <td>
                <span class="status-badge ${statusClass}">
                    ${status}
                </span>
            </td>

            <td>
                <div class="action-buttons">
                    ${actionButtons}
                </div>
            </td>

        `;

        productTableBody.appendChild(row);

    });

}


/* =========================================================
   12. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value).replace(/[&<>"']/g, function (character) {

        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];

    });

}


/* =========================================================
   13. INVENTORY MOVEMENT HISTORY
========================================================= */


/* ---------------------------------------------------------
   POPULATE PRODUCT FILTER
--------------------------------------------------------- */

function populateMovementProductFilter() {

    if (!movementProductFilter) {
        return;
    }

    const selectedProduct = movementProductFilter.value;

    movementProductFilter.innerHTML = `
        <option value="all">All Products</option>
    `;

    products.forEach(function (product) {

        const option = document.createElement("option");

        option.value = product.id;
        option.textContent = product.name;

        movementProductFilter.appendChild(option);

    });

    const productStillExists = products.some(function (product) {
        return product.id === selectedProduct;
    });

    movementProductFilter.value = productStillExists
        ? selectedProduct
        : "all";

}


/* ---------------------------------------------------------
   LOAD INVENTORY MOVEMENTS FROM API
--------------------------------------------------------- */

async function loadInventoryMovements(productId = null) {

    if (!movementHistoryTableBody) {
        return;
    }

    try {

        const response = await productApi.getInventoryMovements(productId);

        if (!response.success || !Array.isArray(response.data)) {
            throw new Error("Invalid inventory movement response.");
        }

        inventoryMovements = response.data;

        displayInventoryMovements();

    } catch (error) {

        console.error(
            "Unable to load inventory movement history:",
            error
        );

        inventoryMovements = [];

        movementHistoryTableBody.innerHTML = "";

        if (movementCount) {
            movementCount.textContent = "0";
        }

        if (emptyMovementHistory) {

            emptyMovementHistory.style.display = "block";

            const heading = emptyMovementHistory.querySelector("h3");
            const description = emptyMovementHistory.querySelector("p");

            if (heading) {
                heading.textContent = "Unable to Load History";
            }

            if (description) {
                description.textContent =
                    "Please check your server connection and try refreshing.";
            }

        }

    }

}


/* ---------------------------------------------------------
   DISPLAY INVENTORY MOVEMENTS
--------------------------------------------------------- */

function displayInventoryMovements() {

    if (!movementHistoryTableBody) {
        return;
    }

    movementHistoryTableBody.innerHTML = "";

    if (movementCount) {
        movementCount.textContent = inventoryMovements.length;
    }

    if (inventoryMovements.length === 0) {

        if (emptyMovementHistory) {

            emptyMovementHistory.style.display = "block";

            const heading = emptyMovementHistory.querySelector("h3");
            const description = emptyMovementHistory.querySelector("p");

            if (heading) {
                heading.textContent = "No Movement Records Found";
            }

            if (description) {
                description.textContent =
                    "Inventory movements will appear here when stock changes are recorded.";
            }

        }

        return;

    }

    if (emptyMovementHistory) {
        emptyMovementHistory.style.display = "none";
    }


    inventoryMovements.forEach(function (movement) {

        const movementDate = new Date(movement.movementDate);

        const formattedDate = Number.isNaN(movementDate.getTime())
            ? "—"
            : movementDate.toLocaleString("en-PH", {
                dateStyle: "medium",
                timeStyle: "short"
            });


        const movementType = String(movement.movementType || "");

        let movementClass = "default";

        if (movementType === "Sale") {
            movementClass = "sale";
        } else if (movementType === "Restock") {
            movementClass = "restock";
        } else if (movementType === "Adjustment In") {
            movementClass = "adjustment-in";
        } else if (movementType === "Adjustment Out") {
            movementClass = "adjustment-out";
        }


        const quantity = Number(movement.quantityChange);

        const quantityClass = quantity > 0
            ? "positive"
            : quantity < 0
                ? "negative"
                : "";

        const formattedQuantity = quantity > 0
            ? `+${quantity}`
            : String(quantity);


        const row = document.createElement("tr");

        row.innerHTML = `

            <td>
                ${escapeHTML(formattedDate)}
            </td>

            <td>
                <span class="product-name">
                    ${escapeHTML(movement.productName || "—")}
                </span>
            </td>

            <td>
                <span class="movement-type-badge ${movementClass}">
                    ${escapeHTML(movementType || "Unknown")}
                </span>
            </td>

            <td>
                <span class="movement-quantity ${quantityClass}">
                    ${escapeHTML(formattedQuantity)}
                </span>
            </td>

            <td>
                <span class="movement-stock-value">
                    ${escapeHTML(movement.stockBefore ?? "—")}
                </span>
            </td>

            <td>
                <span class="movement-stock-value">
                    ${escapeHTML(movement.stockAfter ?? "—")}
                </span>
            </td>

            <td>
                <span class="movement-reason">
                    ${escapeHTML(movement.reason || "—")}
                </span>
            </td>

            <td>
                <span class="movement-performed-by">
                    ${escapeHTML(movement.performedBy || "—")}
                </span>
            </td>

        `;

        movementHistoryTableBody.appendChild(row);

    });

}


/* ---------------------------------------------------------
   PRODUCT FILTER EVENT
--------------------------------------------------------- */

if (movementProductFilter) {

    movementProductFilter.addEventListener("change", function () {

        const selectedProduct = movementProductFilter.value;

        const productId = selectedProduct === "all"
            ? null
            : selectedProduct;

        loadInventoryMovements(productId);

    });

}


/* ---------------------------------------------------------
   REFRESH HISTORY BUTTON
--------------------------------------------------------- */

if (refreshMovementHistoryBtn) {

    refreshMovementHistoryBtn.addEventListener("click", function () {

        const selectedProduct = movementProductFilter
            ? movementProductFilter.value
            : "all";

        const productId = selectedProduct === "all"
            ? null
            : selectedProduct;

        loadInventoryMovements(productId);

    });

}


/* =========================================================
   14. PRODUCT FORM CHANGE TRACKING
========================================================= */

let productFormInitialState = null;


function getProductFormState() {

    if (!productForm) {
        return "";
    }

    return JSON.stringify({
        id: editProductId.value,
        name: productName.value,
        category: productCategory.value,
        price: productPrice.value,
        stock: productStock.value
    });

}


function setProductFormInitialState() {
    productFormInitialState = getProductFormState();
}


function hasUnsavedProductChanges() {

    if (productFormInitialState === null) {
        return false;
    }

    return getProductFormState() !== productFormInitialState;

}


/* =========================================================
   15. OPEN ADD PRODUCT MODAL
========================================================= */

function openAddProductModal() {

    if (!productForm || !productModal) {
        return;
    }

    productForm.reset();

    editProductId.value = "";

    // RESTORE INITIAL STOCK INPUT FOR NEW PRODUCTS
    productStock.readOnly = false;

    modalTitle.textContent = "Add New Product";

    setProductFormInitialState();

    productModal.classList.add("show");

    productName.focus();

}


if (addProductBtn) {
    addProductBtn.addEventListener("click", openAddProductModal);
}


/* =========================================================
   16. OPEN EDIT PRODUCT MODAL
========================================================= */

function openEditProductModal(id) {

    const product = products.find(function (item) {
        return item.id === id;
    });

    if (!product || !productForm || !productModal) {
        return;
    }

    editProductId.value = product.id;

    productName.value = product.name;
    productCategory.value = product.category;
    productPrice.value = product.price;
    productStock.value = product.stock;

    // STOCK IS MANAGED THROUGH ADJUST STOCK
    productStock.readOnly = true;

    modalTitle.textContent = "Edit Product";

    setProductFormInitialState();

    productModal.classList.add("show");

    productName.focus();

}


/* =========================================================
   17. SAVE PRODUCT
========================================================= */

if (productForm) {

    productForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (isReadOnlyUser) {

            await showAppDialog({
                title: "Access Denied",
                message: "You do not have permission to add or edit products.",
                icon: "fa-lock",
                tone: "warning"
            });

            return;
        }

        const id = editProductId.value;

        const name = productName.value.trim();
        const category = productCategory.value;

        const price = Number(productPrice.value);
        const stock = Number(productStock.value);

        const isEditing = Boolean(id);


        const isInvalidStock = !isEditing && (
            !Number.isInteger(stock) ||
            stock < 0
        );

        if (
            name === "" ||
            category === "" ||
            !Number.isFinite(price) ||
            price <= 0 ||
            isInvalidStock
        ) {

            await showAppDialog({
                title: "Invalid Product Information",
                message: "Please enter a valid product name, category, price, and initial stock quantity.",
                icon: "fa-circle-exclamation",
                tone: "warning"
            });

            return;

        }


        const duplicateProduct = products.find(function (product) {

            return product.name.toLowerCase() === name.toLowerCase()
                && product.id !== id;

        });

        if (duplicateProduct) {

            await showAppDialog({
                title: "Duplicate Product",
                message: "A product with this name already exists. Please use a different product name.",
                icon: "fa-copy",
                tone: "warning"
            });

            return;

        }


        const confirmed = await showAppDialog({
            type: "confirm",
            title: isEditing ? "Confirm Product Update" : "Confirm New Product",
            message: isEditing
                ? "Are you sure you want to save the changes to this product? Stock quantity will remain unchanged."
                : "Are you sure you want to add this product to your inventory?",
            icon: isEditing ? "fa-pen-to-square" : "fa-circle-plus",
            confirmText: isEditing ? "Yes, Update" : "Yes, Add Product"
        });

        if (!confirmed) {
            return;
        }


        const productData = {
            name: name,
            category: category,
            price: price
        };

        if (!isEditing) {
            productData.stock = stock;
        }


        // TRACK WHETHER THE DATABASE OPERATION SUCCEEDED
        let mutationSaved = false;

        try {

            if (isEditing) {

                await productApi.update(id, productData);

            } else {

                await productApi.create(productData);

            }

            mutationSaved = true;


            // RETRIEVE UPDATED PRODUCTS FROM MYSQL
            await loadProducts();

            populateMovementProductFilter();

            await loadInventoryMovements(
                getSelectedMovementProductId()
            );


            closeProductFormModal();


            await showAppDialog({
                title: isEditing ? "Product Updated" : "Product Added",
                message: isEditing
                    ? "The product information has been updated successfully. Its stock quantity was not changed."
                    : "The new product has been saved to the database successfully.",
                icon: "fa-circle-check",
                tone: "success"
            });


        } catch (error) {

            console.error("Unable to save product:", error);

            if (mutationSaved) {

                // AVOID RESUBMITTING A PRODUCT THAT WAS ALREADY SAVED
                closeProductFormModal();

            }

            await showAppDialog({
                title: mutationSaved
                    ? "Product Saved, Refresh Failed"
                    : "Unable to Save Product",
                message: mutationSaved
                    ? "The database operation succeeded, but the latest product list could not be retrieved. Please refresh the page to verify the updated records."
                    : error.message || "Something went wrong while saving the product. Please try again.",
                icon: "fa-triangle-exclamation",
                tone: "danger"
            });

        }

    });

}


/* =========================================================
   18. CLOSE PRODUCT MODAL
========================================================= */

function closeProductFormModal() {

    if (!productModal || !productForm) {
        return;
    }

    productModal.classList.remove("show");

    productForm.reset();

    editProductId.value = "";

    // RESTORE THE DEFAULT STATE FOR THE NEXT ADD/EDIT ACTION
    productStock.readOnly = false;

    productFormInitialState = null;

}


async function requestCloseProductModal() {

    if (!productModal || !productModal.classList.contains("show")) {
        return;
    }

    if (!hasUnsavedProductChanges()) {

        closeProductFormModal();

        return;

    }


    const confirmed = await showAppDialog({
        type: "confirm",
        title: "Discard Product Changes",
        message: "You have unsaved changes. Are you sure you want to discard them?",
        icon: "fa-triangle-exclamation",
        tone: "warning",
        confirmText: "Yes, Discard",
        cancelText: "Keep Editing"
    });

    if (confirmed) {
        closeProductFormModal();
    }

}


if (cancelProductBtn) {
    cancelProductBtn.addEventListener("click", requestCloseProductModal);
}


/* =========================================================
   19. DEACTIVATE PRODUCT
========================================================= */

async function deleteProduct(id) {

    const product = products.find(function (item) {
        return item.id === id;
    });

    if (!product) {
        return;
    }


    const confirmed = await showAppDialog({
        type: "confirm",
        title: "Confirm Product Deactivation",
        message: `Are you sure you want to mark "${product.name}" as unavailable? It will remain in your records and can be reactivated later.`,
        icon: "fa-ban",
        tone: "warning",
        confirmText: "Yes, Deactivate",
        cancelText: "Cancel"
    });

    if (!confirmed) {
        return;
    }


    let mutationSaved = false;

    try {

        // SOFT DEACTIVATION THROUGH THE API
        await productApi.deactivate(id);

        mutationSaved = true;


        // REFRESH PRODUCTS FROM MYSQL
        await loadProducts();

        populateMovementProductFilter();

        await loadInventoryMovements(
            getSelectedMovementProductId()
        );


        await showAppDialog({
            title: "Product Deactivated",
            message: `"${product.name}" is now unavailable and has been kept in your inventory records.`,
            icon: "fa-circle-check",
            tone: "success"
        });


    } catch (error) {

        console.error("Unable to deactivate product:", error);

        await showAppDialog({
            title: mutationSaved
                ? "Product Deactivated, Refresh Failed"
                : "Unable to Deactivate Product",
            message: mutationSaved
                ? "The product was successfully deactivated, but the latest product list could not be retrieved. Please refresh the page."
                : error.message || "Something went wrong while deactivating the product. Please try again.",
            icon: "fa-triangle-exclamation",
            tone: "danger"
        });

    }

}


/* =========================================================
   20. REACTIVATE PRODUCT
========================================================= */

async function activateProduct(id) {

    const product = products.find(function (item) {
        return item.id === id;
    });

    if (!product) {
        return;
    }


    const confirmed = await showAppDialog({
        type: "confirm",
        title: "Reactivate Product",
        message: `Are you sure you want to make "${product.name}" available again?`,
        icon: "fa-rotate-left",
        tone: "warning",
        confirmText: "Yes, Reactivate",
        cancelText: "Cancel"
    });

    if (!confirmed) {
        return;
    }


    let mutationSaved = false;

    try {

        // UPDATE PRODUCT STATUS THROUGH THE API
        await productApi.update(id, {
            status: "Available"
        });

        mutationSaved = true;


        // REFRESH PRODUCTS FROM MYSQL
        await loadProducts();

        populateMovementProductFilter();

        await loadInventoryMovements(
            getSelectedMovementProductId()
        );


        await showAppDialog({
            title: "Product Reactivated",
            message: `"${product.name}" is now available again.`,
            icon: "fa-circle-check",
            tone: "success"
        });

    } catch (error) {

        console.error("Unable to reactivate product:", error);

        await showAppDialog({
            title: mutationSaved
                ? "Product Reactivated, Refresh Failed"
                : "Unable to Reactivate Product",
            message: mutationSaved
                ? "The product was successfully reactivated, but the latest product list could not be retrieved. Please refresh the page."
                : error.message || "Something went wrong while reactivating the product. Please try again.",
            icon: "fa-triangle-exclamation",
            tone: "danger"
        });

    }

}


/* =========================================================
   21. OPEN STOCK ADJUSTMENT MODAL
========================================================= */

function openStockModal(id) {

    const product = products.find(function (item) {
        return item.id === id;
    });

    if (!product || !stockForm || !stockModal) {
        return;
    }

    stockForm.reset();

    stockProductId.value = product.id;
    stockProductName.value = product.name;
    currentStockValue.value = product.stock;

    stockAction.value = "add";

    stockModal.classList.add("show");

    stockAction.focus();

}


/* =========================================================
   22. SAVE STOCK ADJUSTMENT
========================================================= */

if (stockForm) {

    stockForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (isReadOnlyUser) {

            await showAppDialog({
                title: "Access Denied",
                message: "You do not have permission to adjust product stock.",
                icon: "fa-lock",
                tone: "warning"
            });

            return;
        }

        const id = stockProductId.value;

        const action = stockAction.value;
        const quantity = Number(stockQuantity.value);
        const reason = stockReason.value.trim();

        const product = products.find(function (item) {
            return item.id === id;
        });

        if (!product) {

            await showAppDialog({
                title: "Product Not Found",
                message: "The selected product could not be found in your inventory.",
                icon: "fa-circle-exclamation",
                tone: "danger"
            });

            return;

        }

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0 ||
            reason === ""
        ) {

            await showAppDialog({
                title: "Invalid Stock Adjustment",
                message: "Please enter a valid quantity and provide a reason for the stock adjustment.",
                icon: "fa-circle-exclamation",
                tone: "warning"
            });

            return;

        }

        const originalStock = product.stock;

        let newStock;

        if (action === "add") {

            if (product.stock + quantity > Number.MAX_SAFE_INTEGER) {

                await showAppDialog({
                    title: "Stock Quantity Too Large",
                    message: "The resulting stock quantity is too large. Please enter a smaller quantity.",
                    icon: "fa-triangle-exclamation",
                    tone: "warning"
                });

                return;

            }

            newStock = product.stock + quantity;

        } else if (action === "remove") {

            if (quantity > product.stock) {

                await showAppDialog({
                    title: "Insufficient Stock",
                    message: "You cannot remove more items than the currently available stock.",
                    icon: "fa-box-open",
                    tone: "warning"
                });

                return;

            }

            newStock = product.stock - quantity;

        } else {

            await showAppDialog({
                title: "Invalid Adjustment Type",
                message: "Please select a valid stock adjustment type.",
                icon: "fa-circle-exclamation",
                tone: "warning"
            });

            return;

        }


        const confirmed = await showAppDialog({
            type: "confirm",
            title: "Confirm Stock Adjustment",
            message: "Please review the stock adjustment details before applying this change.",
            icon: "fa-boxes-stacked",
            confirmText: "Confirm Adjustment",
            details: [
                {
                    label: "Product",
                    value: product.name
                },
                {
                    label: "Adjustment Type",
                    value: action === "add" ? "Add Stock" : "Remove Stock"
                },
                {
                    label: "Quantity",
                    value: String(quantity)
                },
                {
                    label: "Reason",
                    value: reason
                },
                {
                    label: "Current Stock",
                    value: String(originalStock)
                },
                {
                    label: "Resulting Stock",
                    value: String(newStock)
                }
            ]
        });

        if (!confirmed) {
            return;
        }


        try {

            const response = await productApi.adjustStock(id, {
                action: action,
                quantity: quantity,
                reason: reason
            });

            if (!response.success || !response.data) {
                throw new Error(
                    response.message || "Unable to update product stock."
                );
            }


            // USE THE UPDATED STOCK RETURNED BY THE DATABASE
            product.stock = Number(response.data.stock);

            updateInventorySummary();
            displayProducts();


            // REFRESH MOVEMENT HISTORY
            await loadInventoryMovements(
                getSelectedMovementProductId()
            );


            closeStockFormModal();

            await showAppDialog({
                title: "Stock Updated",
                message: `The stock quantity for "${product.name}" has been updated successfully.`,
                icon: "fa-circle-check",
                tone: "success"
            });

        } catch (error) {

            console.error("Stock adjustment failed:", error);

            await showAppDialog({
                title: "Stock Adjustment Failed",
                message: error.message || "An unexpected error occurred while updating stock.",
                icon: "fa-circle-exclamation",
                tone: "danger"
            });

        }

    });

}


/* =========================================================
   23. CLOSE STOCK MODAL
========================================================= */

function closeStockFormModal() {

    if (!stockModal || !stockForm) {
        return;
    }

    stockModal.classList.remove("show");

    stockForm.reset();

}


if (cancelStockBtn) {
    cancelStockBtn.addEventListener("click", closeStockFormModal);
}


/* =========================================================
   24. PRODUCT TABLE ACTIONS
========================================================= */

if (productTableBody) {

    productTableBody.addEventListener("click", function (event) {

        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }


        if (isReadOnlyUser) {

            showAppDialog({
                title: "Access Denied",
                message: "You do not have permission to manage products.",
                icon: "fa-lock",
                tone: "warning"
            });

            return;
        }


        const action = button.dataset.action;
        const id = button.dataset.id;


        if (action === "edit") {

            openEditProductModal(id);

        } else if (action === "stock") {

            openStockModal(id);

        } else if (action === "delete") {

            deleteProduct(id);

        } else if (action === "activate") {

            activateProduct(id);

        }

    });

}


/* =========================================================
   25. SEARCH PRODUCTS
========================================================= */

if (productSearch) {

    productSearch.addEventListener("input", function () {

        displayProducts();

        if (clearSearchBtn) {

            clearSearchBtn.style.display =
                productSearch.value.length > 0 ? "block" : "none";

        }

    });

}


if (clearSearchBtn) {

    clearSearchBtn.addEventListener("click", function () {

        if (productSearch) {
            productSearch.value = "";
        }

        clearSearchBtn.style.display = "none";

        displayProducts();

        if (productSearch) {
            productSearch.focus();
        }

    });

}


/* =========================================================
   26. CATEGORY FILTER
========================================================= */

if (categoryFilter) {

    categoryFilter.addEventListener("change", function () {
        displayProducts();
    });

}


/* =========================================================
   27. STOCK STATUS FILTER
========================================================= */

if (stockFilter) {

    stockFilter.addEventListener("change", function () {
        displayProducts();
    });

}


/* =========================================================
   28. CLOSE MODALS WHEN CLICKING OUTSIDE
========================================================= */

if (productModal) {

    productModal.addEventListener("click", function (event) {

        if (event.target === productModal) {
            requestCloseProductModal();
        }

    });

}


if (stockModal) {

    stockModal.addEventListener("click", function (event) {

        if (event.target === stockModal) {
            closeStockFormModal();
        }

    });

}


/* =========================================================
   29. DASHBOARD-MATCHING LOGOUT MODAL
========================================================= */

function setupLogout() {

    const logoutBtn = document.getElementById("logout-btn");

    if (!logoutBtn) {
        return;
    }

    let logoutModal = null;


    function closeLogoutModal() {

        if (!logoutModal) {
            return;
        }

        const modalToRemove = logoutModal;

        modalToRemove.classList.remove("show");

        document.body.classList.remove("logout-modal-open");

        document.removeEventListener(
            "keydown",
            handleLogoutModalKeydown
        );

        setTimeout(function () {

            modalToRemove.remove();

            if (logoutModal === modalToRemove) {
                logoutModal = null;
            }

            logoutBtn.focus();

        }, 200);

    }


    function handleLogoutModalKeydown(event) {

        if (!logoutModal) {
            return;
        }

        if (event.key === "Escape") {

            event.preventDefault();

            closeLogoutModal();

            return;

        }


        if (event.key === "Tab") {

            const focusableElements = logoutModal.querySelectorAll(
                'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (!firstElement || !lastElement) {
                return;
            }

            if (event.shiftKey && document.activeElement === firstElement) {

                event.preventDefault();

                lastElement.focus();

            } else if (!event.shiftKey && document.activeElement === lastElement) {

                event.preventDefault();

                firstElement.focus();

            }

        }

    }


    function openLogoutModal() {

        if (logoutModal) {
            return;
        }

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
                        class="logout-modal-btn cancel"
                        id="logout-modal-cancel"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        class="logout-modal-btn confirm"
                        id="logout-modal-confirm"
                    >
                        <i class="fa-solid fa-right-from-bracket"></i>
                        Yes, Logout
                    </button>

                </div>

            </section>

        `;


        document.body.appendChild(logoutModal);

        document.body.classList.add("logout-modal-open");


        const cancelButton = logoutModal.querySelector(
            "#logout-modal-cancel"
        );

        const confirmButton = logoutModal.querySelector(
            "#logout-modal-confirm"
        );


        cancelButton.addEventListener("click", closeLogoutModal);


        confirmButton.addEventListener("click", async function () {

            confirmButton.disabled = true;

            try {

                await apiClient.post("/auth/logout", {});

                window.location.replace("./login.html");

            } catch (error) {

                console.error("Logout failed:", error);

                confirmButton.disabled = false;

                await showAppDialog({
                    title: "Logout Failed",
                    message: "Unable to sign out. Please try again.",
                    icon: "fa-triangle-exclamation",
                    tone: "danger"
                });

            }

        });


        logoutModal.addEventListener("click", function (event) {

            if (event.target === logoutModal) {
                closeLogoutModal();
            }

        });


        document.addEventListener(
            "keydown",
            handleLogoutModalKeydown
        );


        requestAnimationFrame(function () {

            logoutModal.classList.add("show");

            cancelButton.focus();

        });

    }


    logoutBtn.addEventListener("click", function (event) {

        event.preventDefault();

        openLogoutModal();

    });

}

setupLogout();


/* =========================================================
   30. CLOSE ACTIVE MODAL OR SIDEBAR USING ESCAPE
========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key !== "Escape") {
        return;
    }

    if (activeAppDialog) {
        return;
    }

    if (productModal && productModal.classList.contains("show")) {

        requestCloseProductModal();

    }

    else if (stockModal && stockModal.classList.contains("show")) {

        closeStockFormModal();

    }

    else if (
        isMobileView() &&
        sidebar &&
        sidebar.classList.contains("mobile-open")
    ) {

        closeMobileSidebar();

    }

});


/* =========================================================
   31. GET SELECTED MOVEMENT PRODUCT ID
========================================================= */

function getSelectedMovementProductId() {

    if (!movementProductFilter) {
        return null;
    }

    const selectedProduct = movementProductFilter.value;

    return selectedProduct === "all"
        ? null
        : selectedProduct;

}


/* =========================================================
   32. INITIALIZE PAGE
========================================================= */

// =========================================================
// AUTHENTICATION AND ROLE MANAGEMENT
// =========================================================

function updateUserProfile(user) {

    const fullName = user.fullName || user.username || "User";

    const role = String(user.role || "Staff").trim();

    const normalizedRole = role.toLowerCase();

    const isOwner = normalizedRole === "owner";
    const canManageProducts = isOwner || normalizedRole === "manager";

    isReadOnlyUser = !canManageProducts;


    const nameElement = document.getElementById("display-user-name");

    if (nameElement) {
        nameElement.textContent = fullName;
    }


    const roleElement = document.getElementById("display-user-role");

    if (roleElement) {
        roleElement.textContent = role;
    }


    const badgeElement = document.getElementById("role-badge");

    if (badgeElement) {
        badgeElement.textContent = `${role} Portal`;
    }


    const avatarElement = document.getElementById("display-user-avatar");

    if (avatarElement) {

        const initials = fullName
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(name => name.charAt(0).toUpperCase())
            .join("");

        avatarElement.textContent = initials || "U";
    }


    document.querySelectorAll(".owner-only").forEach(element => {
        element.style.display = isOwner ? "" : "none";
    });


    document.querySelectorAll(".owner-manager-only").forEach(element => {
        element.style.display = canManageProducts ? "" : "none";
    });


    const addProductButton = document.getElementById("addProductBtn");

    if (addProductButton) {
        addProductButton.style.display = canManageProducts ? "" : "none";
    }

}


// =========================================================
// VERIFY AUTHENTICATION
// =========================================================

async function verifyAuthentication() {

    try {

        const response = await apiClient.get("/auth/me");

        if (!response.success || !response.data?.user) {

            window.location.replace("./login.html");

            return null;
        }

        currentUser = response.data.user;

        updateUserProfile(currentUser);

        return currentUser;

    } catch (error) {

        console.error("Products authentication failed:", error);

        if ([401, 403, 404].includes(error.status)) {

            window.location.replace("./login.html");

            return null;
        }

        document.body.innerHTML = `
            <main style="max-width:600px;margin:80px auto;padding:24px;text-align:center;font-family:Arial,sans-serif;">
                <h2>Unable to Verify Your Session</h2>
                <p>Please make sure the CaféSense backend is running, then try again.</p>
                <button onclick="window.location.reload()">Retry</button>
            </main>
        `;

        return null;
    }

}


// =========================================================
// INITIALIZE PRODUCTS PAGE
// =========================================================

async function initializeProductsPage() {

    const user = await verifyAuthentication();

    if (!user) {
        return;
    }

    updateCurrentDateTime();

    // ADD THE UNAVAILABLE OPTION BEFORE FILTERING
    setupStockFilter();

    try {

        await loadProducts();

        populateMovementProductFilter();

        if (!isReadOnlyUser) {
            await loadInventoryMovements();
        }

    } catch (error) {

        console.error("Products page initialization failed:", error);

        await showAppDialog({
            title: "Unable to Load Products",
            message: "CaféSense could not retrieve the latest product records. Please check your server connection and refresh the page.",
            icon: "fa-triangle-exclamation",
            tone: "danger"
        });

    }

}

initializeProductsPage();
