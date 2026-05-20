import { Router } from "express";
const router = Router();

import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", authMiddleware, controller.logout);

export default router;