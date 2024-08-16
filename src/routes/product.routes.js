import { Router } from "express";
import { ROLES } from "../consts/roles.js";
import { ProductController } from "../controllers/product.controller.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { productService } from "../services/product.service.js";
import { validationMiddlewareFor } from "../utils/validation-middleware.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validations/product.validation.js";

const router = Router();

const controller = new ProductController(productService);

router.get("/", (req, res) => controller.findAllToSell(req, res));

router.get("/mine", [...roleMiddleware(ROLES.SELLER)], (req, res) =>
  controller.findBySeller(req, res)
);

router.get("/:product_id", (req, res) => controller.findById(req, res))

router.post(
  "/",
  [
    ...roleMiddleware(ROLES.SELLER),
    validationMiddlewareFor(createProductSchema),
  ],
  (req, res) => controller.registerProduct(req, res)
);

router.patch(
  "/:product_id",
  [
    ...roleMiddleware(ROLES.SELLER),
    validationMiddlewareFor(updateProductSchema),
  ],
  (req, res) => controller.updateProduct(req, res)
);

router.delete("/:product_id", [...roleMiddleware(ROLES.SELLER)], (req, res) =>
  controller.deleteProduct(req, res)
);

export default router;
