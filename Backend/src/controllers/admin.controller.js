
import * as userService from "../services/user.service.js";

async function getAdminDashboard(req, res) {
    res.json({
        message: 'Welcome to the admin dashboard!'
    });
}

async function getAllUsers(req, res) {
    try {
        const user = req.user; 
        const users = await userService.getAllUsers(user.id);
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getUserById(req, res) {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function deleteUser(req, res) {
    try {
        await userService.deleteUser(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export default {
    getAdminDashboard,
    getAllUsers,
    getUserById,
    deleteUser,
};