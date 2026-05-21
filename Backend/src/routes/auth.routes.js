

import authController from "../controllers/auth.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authMiddleware, authController.logout);
router.get('/',(req, res, next)=>{
    res.json({
        message:'quiz api est lance ...'
    })
});


export default router;