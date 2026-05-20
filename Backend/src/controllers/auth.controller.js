import { register as _register, login as _login, refresh as _refresh } from "../services/auth.service.js";

const cookieOptions = {
  httpOnly: true,
  secure: false, // true en production (HTTPS)
  sameSite: "lax",
};

async function register(req, res) {
  try {
    const { user, accessToken, refreshToken } =
      await service.register(req.body);

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { user, accessToken, refreshToken } =
      await service.login(req.body);

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    res.json({ user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function refresh(req, res) {
  try {
    const token = req.cookies.refreshToken;

    const { accessToken } = await service.refresh(token);

    res.cookie("accessToken", accessToken, cookieOptions);

    res.json({ success: true });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

async function logout(req, res) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out" });
}
export default {
  register,
  login,
  refresh,
  logout
};