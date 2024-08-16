import { Router } from "express";
import { ROLES } from "../consts/roles.js";
import { PurchaseController } from "../controllers/purchase.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { purchaseService } from "../services/purchase.service.js";
import { validationMiddlewareFor } from "../utils/validation-middleware.js";
import { makePurchaseSchema } from "../validations/purchase.validation.js";

const router = Router();
const controller = new PurchaseController(purchaseService);

router.post(
  "/",
  [...roleMiddleware(ROLES.BUYER), validationMiddlewareFor(makePurchaseSchema)],
  (req, res) => controller.buyProductsInBulk(req, res)
);

router.get(
  "/mine",
  [...roleMiddleware(ROLES.BUYER)],
  (req, res) => controller.findAllPurchasesForBuyer(req, res)
);

export default router;
