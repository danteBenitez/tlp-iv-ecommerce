import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { usersService } from "../services/user.service.js";

const router = Router();

const controller = new UserController(usersService);

router.post("/auth/sign-in", controller.signIn);
router.post("/auth/sign-up", controller.signUp);

export default router; 