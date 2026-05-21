import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/role.middleware.js";
import adminController from "../controllers/admin.controller.js";



const router = Router();

/** * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Obtenir le tableau de bord admin
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tableau de bord admin
 */
router.get('/dashboard', authMiddleware, authorizeRole(['ADMIN']), adminController.getAdminDashboard);

/** * @swagger
 * /admin/users:
 *   get:
 *     summary: Obtenir la liste des utilisateurs
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 */
router.get('/users', authMiddleware, authorizeRole(['ADMIN']), adminController.getAllUsers);

/** * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Obtenir un utilisateur par ID
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur trouve
 */
router.get('/users/:id', authMiddleware, authorizeRole(['ADMIN']), adminController.getUserById);

/** * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par ID
 *     tags:
 *       - Admin
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprime
 */ 
router.delete('/users/:id', authMiddleware, authorizeRole(['ADMIN']), adminController.deleteUser);


export default router;