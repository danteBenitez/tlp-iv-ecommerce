import { Router } from "express";
import { ROLES } from "../consts/roles.js";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { usersService } from "../services/user.service.js";
import { validationMiddlewareFor } from "../utils/validation-middleware.js";
import {
  signInUserSchema,
  signUpUserSchema,
  updateUserSchema,
} from "../validations/user.validation.js";

const router = Router();

const controller = new UserController(usersService);

router.get("/users", [...roleMiddleware(ROLES.ADMIN)], (req, res) =>
  controller.findAllUsers(req, res)
);
router.patch("/users/:user_id", [...roleMiddleware(ROLES.ADMIN)], (req, res) =>
  controller.updateUserById(req, res)
);
router.delete("/users/:user_id", [...roleMiddleware(ROLES.ADMIN)], (req, res) =>
  controller.deleteUserById(req, res)
);

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
router.patch(
  "/profile",
  [authMiddleware, validationMiddlewareFor(updateUserSchema)],
  (req, res) => controller.updateProfile(req, res)
);

export default router;
