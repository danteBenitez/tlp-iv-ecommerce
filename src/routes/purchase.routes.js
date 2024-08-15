import { Router } from "express";
import { validationMiddlewareFor } from "../utils/validation-middleware.js";
import { makePurchase } from "../validations/purchase.validation.js";

const router = Router();

router.post("/", [validationMiddlewareFor(makePurchase)], (req, res) =>
  res.json({ msg: "Hello, world" })
);

export default router;
