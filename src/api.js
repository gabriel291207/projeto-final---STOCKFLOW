
const STORAGE_KEY = "stockflow_products";

function getProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export const api = {
  async list() {
    return getProducts();
  },

  async create(record) {
    const products = getProducts();

    const newProduct = {
      ...record,
      id: crypto.randomUUID(),
    };

    products.push(newProduct);
    saveProducts(products);

    return newProduct;
  },

  async update(id, record) {
    const products = getProducts();

    const index = products.findIndex(
      (product) => String(product.id ?? product._id) === String(id)
    );

    if (index === -1) {
      throw new Error("Produto não encontrado.");
    }

    products[index] = {
      ...products[index],
      ...record,
      id: products[index].id ?? products[index]._id,
    };

    saveProducts(products);

    return products[index];
  },

  async remove(id) {
    const products = getProducts();

    const updatedProducts = products.filter(
      (product) => String(product.id ?? product._id) !== String(id)
    );

    if (updatedProducts.length === products.length) {
      throw new Error("Produto não encontrado.");
    }

    saveProducts(updatedProducts);

    return true;
  },
};
