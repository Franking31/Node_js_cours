import { findByEmail as _findByEmail, 
    createUser as _createUser, 
    findById as _findById, 
    updateUser as _updateUser, 
    deleteUser as _deleteUser, 
    getAllUsers as _getAllUsers 
} from "../repositories/auth.repository.js";

async function getUserById(id) {
  return await _findById(id);
}

async function getUserByEmail(email) {
  return await _findByEmail(email);
}

async function createNewUser(userData) {
    const existingUser = await _findByEmail(userData.email);
    if (existingUser) throw new Error("Email already in use");
  return await _createUser(userData);
}

async function updateUser(id, updateData) {
  const user = await _findById(id);
  if (!user) throw new Error("User not found");

  return await _updateUser(id, updateData);
}

async function deleteUser(id) {
  const user = await _findById(id);
  if (!user) throw new Error("User not found");

  return await _deleteUser(id);
}

async function getAllUsers(currentUserId) {
  const users = await _getAllUsers(currentUserId);
  return users.map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }));
}

export { getUserById, getUserByEmail, createNewUser, updateUser, deleteUser, getAllUsers };