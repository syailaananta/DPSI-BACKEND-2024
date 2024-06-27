const express = require("express");
const Supplier = require("../models/supplier");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  try {
    const result = await Supplier.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const result = await Supplier.findAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const result = await Supplier.findByPk(req.params.id);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Supplier not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  try {
    const [updated] = await Supplier.update(req.body, {
      where: { supplierID: req.params.id },
    });
    if (updated) {
      const updatedSupplier = await Supplier.findByPk(req.params.id);
      res.json(updatedSupplier);
    } else {
      res.status(404).json({ error: "Supplier not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const result = await Supplier.destroy({
      where: { supplierID: req.params.id },
    });
    if (result) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Supplier not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;