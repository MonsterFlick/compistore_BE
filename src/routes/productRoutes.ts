import express from "express";
import { getRepository } from "typeorm";
import { Product } from "../entity/Product";

const router = express.Router();

router.get("/", async (_, res) => {
  const repo = getRepository(Product);
  const products = await repo.find();
  res.json(products);
});
router.get("/:id", async (req, res) => {
  const repo = getRepository(Product);
  const product = await repo.findOneBy({ id: parseInt(req.params.id) });
  if (!product) console.log( res.status(404).json({ message: "Not found" }))
  res.json(product);
});

router.post("/", async (req, res) => {
  const repo = getRepository(Product);
  const product = repo.create(req.body);
  const result = await repo.save(product);
  res.json(result);
});

router.delete("/:id", async (req, res) => {
  const repo = getRepository(Product);
  await repo.delete(req.params.id);
  res.json({ message: "Deleted" });
});

router.put("/:id", async (req, res) => {
  const repo = getRepository(Product);
  const id = parseInt(req.params.id);

  try {
    const existing = await repo.findOneBy({ id });
    if (!existing) {
      console.log(res.status(404).json({ message: "Product not found" }));
       
      return 
    }

    repo.merge(existing, req.body);
    const result = await repo.save(existing);
    res.json(result);
  } catch (err: any) {
    console.error("PUT /products/:id error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;