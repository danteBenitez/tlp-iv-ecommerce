import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { usersService } from "../services/user.service";

const router = Router();

const controller = new UserController(usersService);

router.post("/auth/sign-in", controller.signIn);
router.post("/auth/sign-up", controller.signUp);

export default router; 