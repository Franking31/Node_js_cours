
import { env } from "../config/env.js";
import { register as _register, login as _login, refresh as _refresh, me as _me } from "../services/auth.service.js";

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,        // true en prod (HTTPS), false en local
  sameSite: isProd ? "none" : "lax",  // "none" requis pour cross-site en prod
};

async function register(req, res) {
  try {
    const { user, accessToken, refreshToken } =
      await _register(req.body);

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.json({ user, accessToken, refreshToken });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { user, accessToken, refreshToken } =
      await _login(req.body);

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.json({ user, accessToken, refreshToken });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken ?? req.headers.authorization?.split(" ")[1];

    const { accessToken } = await _refresh(token);

    res.cookie("accessToken", accessToken, cookieOptions);

    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

async function logout(req, res) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out" });
}

async function me(req, res) {
  try {
    const user = await _me(req.user.id);
    if (!user) throw new Error("User not found");
    res.json({ user });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export default {
  register,
  login,
  refresh,
  logout,
  me,
};