// backend/server.js
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const DATA_DIR = __dirname;

// ✅ If you have images in backend/images, this will serve them at /images/...
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(cors());
app.use(express.json());

async function readJson(fileName) {
  const filePath = path.join(DATA_DIR, fileName);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function writeJson(fileName, data) {
  const filePath = path.join(DATA_DIR, fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// -------------------- PRODUCTS --------------------
app.get("/api/products", async (req, res) => {
  try {
    const products = await readJson("products.json");
    const search = String(req.query.search || "").trim().toLowerCase();

    if (!search) return res.json(products);

    const filtered = products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(search);
      const keywordMatch = Array.isArray(p.keywords)
        ? p.keywords.some((k) => String(k).toLowerCase().includes(search))
        : false;
      return nameMatch || keywordMatch;
    });

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// -------------------- DELIVERY OPTIONS --------------------
app.get("/api/delivery-options", async (req, res) => {
  try {
    const options = await readJson("deliveryOptions.json");

    // Your frontend sometimes requests:
    // /api/delivery-options?expand=estimatedDeliveryTime
    // We'll ignore expand and just return options; frontend converts deliveryDays -> date.
    res.json(options);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// -------------------- CART ITEMS --------------------
app.get("/api/cart-items", async (req, res) => {
  try {
    const cart = await readJson("cart.json");
    const expand = String(req.query.expand || "");

    if (expand === "product") {
      const products = await readJson("products.json");
      const enriched = cart.map((item) => ({
        ...item,
        product: products.find((p) => p.id === item.productId),
      }));
      return res.json(enriched);
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/api/cart-items", async (req, res) => {
  try {
    const { productId, quantity } = req.body || {};
    if (!productId) return res.status(400).json({ error: "productId required" });

    const cart = await readJson("cart.json");
    const qty = Number(quantity) || 1;

    const existing = cart.find((c) => c.productId === productId);
    if (existing) {
      existing.quantity += qty;
    } else {
      // default delivery option if missing
      cart.push({ productId, quantity: qty, deliveryOptionId: "1" });
    }

    await writeJson("cart.json", cart);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.put("/api/cart-items/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, deliveryOptionId } = req.body || {};

    const cart = await readJson("cart.json");
    const item = cart.find((c) => c.productId === productId);

    if (!item) return res.status(404).json({ error: "cart item not found" });

    if (quantity !== undefined) item.quantity = Number(quantity);
    if (deliveryOptionId !== undefined) item.deliveryOptionId = String(deliveryOptionId);

    // if quantity becomes 0 => delete
    if (item.quantity <= 0) {
      const newCart = cart.filter((c) => c.productId !== productId);
      await writeJson("cart.json", newCart);
      return res.json({ ok: true });
    }

    await writeJson("cart.json", cart);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.delete("/api/cart-items/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await readJson("cart.json");
    const newCart = cart.filter((c) => c.productId !== productId);
    await writeJson("cart.json", newCart);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// -------------------- PAYMENT SUMMARY --------------------
app.get("/api/payment-summary", async (req, res) => {
  try {
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

      const option = deliveryOptions.find((o) => o.id === item.deliveryOptionId);
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
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// -------------------- ORDERS --------------------
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await readJson("orders.json");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const expand = String(req.query.expand || "");
    const orders = await readJson("orders.json");

    const order = orders.find((o) => o.id === orderId);
    if (!order) return res.status(404).json({ error: "order not found" });

    if (expand === "products") {
      const products = await readJson("products.json");
      const enrichedProducts = order.products.map((op) => ({
        ...op,
        product: products.find((p) => p.id === op.productId),
      }));
      return res.json({ ...order, products: enrichedProducts });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/api/orders", async (req, res) => {
  try {
    const cart = await readJson("cart.json");
    const products = await readJson("products.json");
    const deliveryOptions = await readJson("deliveryOptions.json");
    const orders = await readJson("orders.json");

    if (!cart.length) return res.status(400).json({ error: "cart is empty" });

    const now = Date.now();

    // Build order products with estimatedDeliveryTimeMs based on deliveryDays
    const orderProducts = cart.map((item) => {
      const option = deliveryOptions.find((o) => o.id === item.deliveryOptionId);
      const deliveryDays = option ? option.deliveryDays : 7;

      return {
        productId: item.productId,
        quantity: item.quantity,
        estimatedDeliveryTimeMs: now + deliveryDays * 24 * 60 * 60 * 1000,
      };
    });

    // Calculate totalCostCents (same as payment summary)
    let productCostCents = 0;
    let shippingCostCents = 0;

    for (const item of cart) {
      const product = products.find((p) => p.id === item.productId);
      if (product) productCostCents += product.priceCents * item.quantity;

      const option = deliveryOptions.find((o) => o.id === item.deliveryOptionId);
      if (option) shippingCostCents += option.priceCents;
    }

    const totalBeforeTaxCents = productCostCents + shippingCostCents;
    const taxCents = Math.round(totalBeforeTaxCents * 0.1);
    const totalCostCents = totalBeforeTaxCents + taxCents;

    const newOrder = {
      id: crypto.randomUUID(),
      orderTimeMs: now,
      totalCostCents,
      products: orderProducts,
    };

    orders.unshift(newOrder);
    await writeJson("orders.json", orders);

    // Clear cart
    await writeJson("cart.json", []);

    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// -------------------- RESET (optional) --------------------
app.post("/api/reset", async (req, res) => {
  // If you want reset, you can implement it later.
  res.json({ ok: true, message: "reset not implemented in this JSON server" });
});

// -------------------- START --------------------
app.listen(PORT, () => {
  console.log(`✅ JSON API server running at http://localhost:${PORT}`);
  console.log(`✅ products:  http://localhost:${PORT}/api/products`);
  console.log(`✅ cart:      http://localhost:${PORT}/api/cart-items?expand=product`);
  console.log(`✅ delivery:  http://localhost:${PORT}/api/delivery-options`);
  console.log(`✅ orders:    http://localhost:${PORT}/api/orders`);
  console.log(`✅ payment:   http://localhost:${PORT}/api/payment-summary`);
});
