import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/role.middleware.js";
import adminController from "../controllers/admin.controller.js";



const router = Router();

router.get('/dashboard', authMiddleware, authorizeRole(['ADMIN']), adminController.getAdminDashboard);
router.get('/users', authMiddleware, authorizeRole(['ADMIN']), adminController.getAllUsers);
router.get('/users/:id', authMiddleware, authorizeRole(['ADMIN']), adminController.getUserById);
router.delete('/users/:id', authMiddleware, authorizeRole(['ADMIN']), adminController.deleteUser);


export default router;