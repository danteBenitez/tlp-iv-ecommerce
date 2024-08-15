import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { usersService } from "../services/user.service.js";
import { validationMiddlewareFor } from "../utils/validation-middleware.js";
import {
  signInUserSchema,
  signUpUserSchema,
} from "../validations/user.validation.js";

const router = Router();

const controller = new UserController(usersService);

router.post(
  "/auth/sign-in",
  [validationMiddlewareFor(signInUserSchema)],
  (req, res) => controller.signIn(req, res)
);

router.post(
  "/auth/sign-up",
  [validationMiddlewareFor(signUpUserSchema)],
  (req, res) => controller.signUp(req, res)
);

router.get("/profile", [authMiddleware], (req, res) =>
  controller.getProfile(req, res)
);

export default router;
