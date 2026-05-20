import { hash, compare } from "bcrypt";
import { findByEmail, createUser, findById } from "../repositories/auth.repository.js";
import { signAccessToken, signRefreshToken, verifyRefresh } from "../config/jwt.js";

async function register(data) {
  const existing = await findByEmail(data.email);

  if (existing) throw new Error("User already exists");

  const hashedPassword = await hash(data.password, 12);

  const user = await createUser({
    email: data.email,
    name: data.name,
    password: hashedPassword,
    role: "STUDENT",
  });

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  return { user, accessToken, refreshToken };
}

async function login(data) {
  const user = await findByEmail(data.email);

  if (!user) throw new Error("Invalid credentials");

  const isValid = await compare(data.password, user.password);

  if (!isValid) throw new Error("Invalid credentials");

  const accessToken = signAccessToken({ id: user.id, role: user.role });
  const refreshToken = signRefreshToken({ id: user.id });

  return { user, accessToken, refreshToken };
}

async function refresh(token) {
  const payload = verifyRefresh(token);

  const user = await findById(payload.id);

  if (!user) throw new Error("User not found");

  const accessToken = signAccessToken({ id: user.id, role: user.role });

  return { accessToken };
}

export {
  register,
  login,
  refresh,
};