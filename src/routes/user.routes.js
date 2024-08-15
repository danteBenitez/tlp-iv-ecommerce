import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
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

export default router;
