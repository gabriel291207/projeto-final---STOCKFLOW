
const KEYS = {
  products: "stockflow_products",
  movements: "stockflow_movements",
  user: "stockflow_user",
};

function read(key, fallback = []) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}
function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
const makeId = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const store = {
  keys: KEYS,
  getProducts: () => read(KEYS.products),
  getMovements: () => read(KEYS.movements),
  getUser: () => read(KEYS.user, null),
  setUser: (user) => write(KEYS.user, user),
  clearUser: () => localStorage.removeItem(KEYS.user),

  createProduct(data) {
    const products = this.getProducts();
    const normalizedName = data.name.trim().toLocaleLowerCase("pt-BR");
    if (products.some(p => p.name.trim().toLocaleLowerCase("pt-BR") === normalizedName)) {
      throw new Error("Já existe um produto com esse nome.");
    }
    const product = { ...data, id: makeId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    products.unshift(product);
    write(KEYS.products, products);
    return product;
  },
  updateProduct(id, data) {
    const products = this.getProducts();
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index < 0) throw new Error("Produto não encontrado.");
    const duplicate = products.some(p => p.id !== id && p.name.trim().toLocaleLowerCase("pt-BR") === data.name.trim().toLocaleLowerCase("pt-BR"));
    if (duplicate) throw new Error("Já existe outro produto com esse nome.");
    products[index] = { ...products[index], ...data, id, updatedAt: new Date().toISOString() };
    write(KEYS.products, products);
    return products[index];
  },
  deleteProduct(id) {
    const products = this.getProducts();
    const next = products.filter(p => String(p.id) !== String(id));
    if (next.length === products.length) throw new Error("Produto não encontrado.");
    write(KEYS.products, next);
    return true;
  },
  moveStock({ productId, type, quantity, note = "" }) {
    const products = this.getProducts();
    const index = products.findIndex(p => String(p.id) === String(productId));
    if (index < 0) throw new Error("Selecione um produto válido.");
    const amount = Number(quantity);
    if (!Number.isInteger(amount) || amount <= 0) throw new Error("Informe uma quantidade inteira maior que zero.");
    const current = Number(products[index].quantity);
    if (type === "saida" && amount > current) throw new Error("A saída não pode ser maior que o estoque disponível.");
    products[index] = { ...products[index], quantity: type === "entrada" ? current + amount : current - amount, updatedAt: new Date().toISOString() };
    const movement = { id: makeId(), productId, productName: products[index].name, type, quantity: amount, note: note.trim(), date: new Date().toISOString(), balance: products[index].quantity };
    const movements = this.getMovements();
    movements.unshift(movement);
    write(KEYS.products, products);
    write(KEYS.movements, movements);
    return movement;
  },
  clearAll() {
    localStorage.removeItem(KEYS.products);
    localStorage.removeItem(KEYS.movements);
  }
};
