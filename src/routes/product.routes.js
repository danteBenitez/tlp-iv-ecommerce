import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validationMiddlewareFor } from "../utils/validation-middleware.js";
import { ProductController } from "../controllers/product.controller.js";
import { productService } from "../services/product.service.js";
import { createProductSchema, updateProductSchema } from "../validations/product.validation.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { ROLES } from "../consts/roles.js";

const router = Router();

const controller = new ProductController(productService);


router.post(
  "/",
  [...roleMiddleware(ROLES.SELLER), validationMiddlewareFor(createProductSchema)],
  (req, res) => controller.registerProduct(req, res)
);

router.patch(
  "/:product_id",
  [...roleMiddleware(ROLES.SELLER), validationMiddlewareFor(updateProductSchema)],
  (req, res) => controller.updateProduct(req, res)
);

export default router;