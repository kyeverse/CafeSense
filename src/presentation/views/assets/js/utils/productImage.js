/**
 * Product Image Resolver
 * Resolves high-resolution local product photos based on product identity, keywords, and category fallback.
 */

const BASE_PATH = "../assets/images/products/";

// Supports numeric IDs ("1", 1) and formatted IDs ("P001")
const DIRECT_MAP = {
    "1": `${BASE_PATH}latte.jpg`,
    "P001": `${BASE_PATH}latte.jpg`,
    "2": `${BASE_PATH}americano.jpg`,
    "P002": `${BASE_PATH}americano.jpg`,
    "3": `${BASE_PATH}cappuccino.jpg`,
    "P003": `${BASE_PATH}cappuccino.jpg`,
    "4": `${BASE_PATH}macchiato.jpg`,
    "P004": `${BASE_PATH}macchiato.jpg`,
    "5": `${BASE_PATH}spanish-latte.jpg`,
    "P005": `${BASE_PATH}spanish-latte.jpg`,
    "6": `${BASE_PATH}matcha.jpg`,
    "P006": `${BASE_PATH}matcha.jpg`,
    "7": `${BASE_PATH}chocolate-milk.jpg`,
    "P007": `${BASE_PATH}chocolate-milk.jpg`,
    "8": `${BASE_PATH}strawberry-milk.jpg`,
    "P008": `${BASE_PATH}strawberry-milk.jpg`,
    "9": `${BASE_PATH}cheesecake.jpg`,
    "P009": `${BASE_PATH}cheesecake.jpg`,
    "10": `${BASE_PATH}muffin.jpg`,
    "P010": `${BASE_PATH}muffin.jpg`,
    "11": `${BASE_PATH}croissant.jpg`,
    "P011": `${BASE_PATH}croissant.jpg`,
    "12": `${BASE_PATH}cookie.jpg`,
    "P012": `${BASE_PATH}cookie.jpg`
};

const CATEGORY_MAP = {
    "coffee": `${BASE_PATH}coffee-default.jpg`,
    "non-coffee": `${BASE_PATH}non-coffee-default.jpg`,
    "pastries": `${BASE_PATH}pastry-default.jpg`,
    "pastry / baked good": `${BASE_PATH}pastry-default.jpg`
};

export function getProductImageUrl(product = {}) {
    const rawId = String(product.id || "").trim();
    if (rawId && DIRECT_MAP[rawId]) {
        return DIRECT_MAP[rawId];
    }

    const name = String(product.name || "").toLowerCase().trim();

    // Specific baked goods must precede generic 'chocolate'
    if (name.includes("muffin")) return `${BASE_PATH}muffin.jpg`;
    if (name.includes("cookie")) return `${BASE_PATH}cookie.jpg`;
    if (name.includes("croissant")) return `${BASE_PATH}croissant.jpg`;
    if (name.includes("cheesecake") || name.includes("cake")) return `${BASE_PATH}cheesecake.jpg`;

    // Specialty drinks must precede generic 'latte'
    if (name.includes("matcha")) return `${BASE_PATH}matcha.jpg`;
    if (name.includes("strawberry")) return `${BASE_PATH}strawberry-milk.jpg`;
    if (name.includes("chocolate")) return `${BASE_PATH}chocolate-milk.jpg`;
    if (name.includes("spanish latte") || name.includes("spanish")) return `${BASE_PATH}spanish-latte.jpg`;
    if (name.includes("macchiato") || name.includes("caramel")) return `${BASE_PATH}macchiato.jpg`;
    if (name.includes("cappuccino")) return `${BASE_PATH}cappuccino.jpg`;
    if (name.includes("americano")) return `${BASE_PATH}americano.jpg`;
    if (name.includes("latte") || name.includes("espresso")) return `${BASE_PATH}latte.jpg`;

    const category = String(product.category || "").toLowerCase().trim();
    if (CATEGORY_MAP[category]) {
        return CATEGORY_MAP[category];
    }

    // shortcut: static image catalog, server media uploads if dynamic photo feature requested
    return `${BASE_PATH}general-default.jpg`;
}
