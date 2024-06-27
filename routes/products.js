const express = require("express");
const router = express.Router();
const Products = require("../models/products");
const { authenticate, authorize } = require("../middleware/auth");

// Endpoint untuk menambahkan produk baru
router.post("/", authenticate, authorize(["admin"]), async (req, res, next) => {
  try {
    console.log("Data yang diterima:", req.body); // Debugging data request body
    const product = await Products.create(req.body);
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    console.error("Error saat menambahkan produk:", err);
    next(err);
  }
});

// Endpoint untuk menampilkan semua produk
router.get("/", authenticate, async (req, res, next) => {
  try {
    const products = await Products.findAll();
    res.json(products);
  } catch (err) {
    console.error("Error saat menampilkan semua produk:", err);
    next(err);
  }
});

// Endpoint untuk menampilkan produk berdasarkan ID
router.get("/:id", authenticate, async (req, res, next) => {
  try {
    const product = await Products.findByPk(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Error saat menampilkan produk:", err);
    next(err);
  }
});

// Endpoint untuk memperbarui produk berdasarkan ID
router.put("/:id", authenticate, authorize(["admin"]), async (req, res, next) => {
  try {
    const { productName, supplierID, categoryID, unit, price } = req.body;
    const product = await Products.findByPk(req.params.id);
    if (product) {
      product.productName = productName;
      product.supplierID = supplierID;
      product.categoryID = categoryID;
      product.unit = unit;
      product.price = price;
      await product.save();
      res.json({ message: "Product updated successfully", product });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Error saat memperbarui produk:", err);
    next(err);
  }
});

// Endpoint untuk menghapus produk berdasarkan ID
router.delete("/:id", authenticate, authorize(["admin"]), async (req, res, next) => {
  try {
    const product = await Products.findByPk(req.params.id);
    if (product) {
      await product.destroy();
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Error saat menghapus produk:", err);
    next(err);
  }
});

module.exports = router;
