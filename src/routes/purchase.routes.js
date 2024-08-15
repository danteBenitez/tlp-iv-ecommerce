import { Router } from "express";
import { validationMiddlewareFor } from "../utils/validation-middleware.js";
import { makePurchaseSchema } from "../validations/purchase.validation.js";

const router = Router();

router.post("/", [validationMiddlewareFor(makePurchaseSchema)], (req, res) =>
  res.json({ msg: "Hello, world" })
);

export default router;
