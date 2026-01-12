import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ This points to your frontend public/backend folder:
const DATA_DIR = path.join(__dirname, "..", "public", "backend");

app.use(cors());
app.use(express.json());

// ---------- helpers ----------
async function readJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const text = await fs.readFile(filePath, "utf-8");
  return JSON.parse(text);
}

async function writeJson(fileName, data) {
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ---------- routes ----------

// ✅ products
app.get("/api/products", async (req, res) => {
  const products = await readJson("products.json");

  const search = (req.query.search || "").toString().toLowerCase().trim();
  if (!search) return res.json(products);

  const filtered = products.filter((p) => {
    return (
      p.name.toLowerCase().includes(search) ||
      (p.keywords || []).some((k) => k.toLowerCase().includes(search))
    );
  });

  res.json(filtered);
});

// ✅ delivery options
app.get("/api/delivery-options", async (req, res) => {
  const deliveryOptions = await readJson("deliveryOptions.json");
  res.json(deliveryOptions);
});

// ✅ cart items (expand=product supported)
app.get("/api/cart-items", async (req, res) => {
  const cart = await readJson("cart.json");
  const products = await readJson("products.json");

  const expand = req.query.expand;

  if (expand === "product") {
    const expanded = cart.map((item) => ({
      ...item,
      product: products.find((p) => p.id === item.productId),
    }));
    return res.json(expanded);
  }

  res.json(cart);
});

// ✅ add to cart
app.post("/api/cart-items", async (req, res) => {
  const cart = await readJson("cart.json");
  const { productId, quantity } = req.body;

  const existing = cart.find((x) => x.productId === productId);

  if (existing) {
    existing.quantity += Number(quantity || 1);
  } else {
    cart.push({
      productId,
      quantity: Number(quantity || 1),
      deliveryOptionId: "1",
    });
  }

  await writeJson("cart.json", cart);
  res.json({ ok: true });
});

// ✅ update cart item (quantity or deliveryOptionId)
app.put("/api/cart-items/:productId", async (req, res) => {
  const cart = await readJson("cart.json");
  const { productId } = req.params;
  const { quantity, deliveryOptionId } = req.body;

  const item = cart.find((x) => x.productId === productId);
  if (!item) return res.status(404).json({ error: "Cart item not found" });

  if (quantity !== undefined) item.quantity = Number(quantity);
  if (deliveryOptionId !== undefined) item.deliveryOptionId = String(deliveryOptionId);

  await writeJson("cart.json", cart);
  res.json({ ok: true });
});

// ✅ delete cart item
app.delete("/api/cart-items/:productId", async (req, res) => {
  const cart = await readJson("cart.json");
  const { productId } = req.params;

  const updated = cart.filter((x) => x.productId !== productId);
  await writeJson("cart.json", updated);

  res.json({ ok: true });
});

// ✅ payment summary
app.get("/api/payment-summary", async (req, res) => {
  const cart = await readJson("cart.json");
  const products = await readJson("products.json");
  const deliveryOptions = await readJson("deliveryOptions.json");

  let totalItems = 0;
  let productCostCents = 0;
  let shippingCostCents = 0;

  for (const item of cart) {
    totalItems += item.quantity;

    const product = products.find((p) => p.id === item.productId);
    if (product) productCostCents += product.priceCents * item.quantity;

    const option = deliveryOptions.find((d) => d.id === item.deliveryOptionId);
    if (option) shippingCostCents += option.priceCents;
  }

  const totalBeforeTaxCents = productCostCents + shippingCostCents;
  const taxCents = Math.round(totalBeforeTaxCents * 0.1);
  const totalCostCents = totalBeforeTaxCents + taxCents;

  res.json({
    totalItems,
    productCostCents,
    shippingCostCents,
    totalBeforeTaxCents,
    taxCents,
    totalCostCents,
  });
});

// ✅ orders list (expand=products supported)
app.get("/api/orders", async (req, res) => {
  const orders = await readJson("orders.json");
  res.json(orders);
});

// ✅ single order (expand=products adds product info)
app.get("/api/orders/:orderId", async (req, res) => {
  const orders = await readJson("orders.json");
  const products = await readJson("products.json");

  const order = orders.find((o) => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });

  if (req.query.expand === "products") {
    return res.json({
      ...order,
      products: order.products.map((op) => ({
        ...op,
        product: products.find((p) => p.id === op.productId),
      })),
    });
  }

  res.json(order);
});

// ✅ place order (creates a new order, clears cart)
app.post("/api/orders", async (req, res) => {
  const cart = await readJson("cart.json");
  const products = await readJson("products.json");
  const orders = await readJson("orders.json");

  const now = Date.now();

  let totalCostCents = 0;

  const newOrderProducts = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (product) totalCostCents += product.priceCents * item.quantity;

    // fake estimated delivery (3 days)
    return {
      productId: item.productId,
      quantity: item.quantity,
      estimatedDeliveryTimeMs: now + 3 * 24 * 60 * 60 * 1000,
    };
  });

  const newOrder = {
    id: crypto.randomUUID(),
    orderTimeMs: now,
    totalCostCents,
    products: newOrderProducts,
  };

  orders.unshift(newOrder);

  await writeJson("orders.json", orders);
  await writeJson("cart.json", []);

  res.json(newOrder);
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`✅ Serving data from: ${DATA_DIR}`);
});
