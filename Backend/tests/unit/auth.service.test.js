import * as service from "../../src/services/auth.service.js";
import * as repo from "../../src/repositories/auth.repository.js";
import * as jwt from "../../src/config/jwt.js";
import bcrypt from "bcrypt";

jest.mock("../../src/repositories/auth.repository.js");
jest.mock("../../src/config/jwt.js");
jest.mock("bcrypt");

const mockUser = { id: "1", email: "a@a.com", name: "John", role: "STUDENT", password: "hashed" };

beforeEach(() => {
  jest.clearAllMocks();
  jwt.signAccessToken.mockReturnValue("access-token");
  jwt.signRefreshToken.mockReturnValue("refresh-token");
});

// ─── register ────────────────────────────────────────────────────────────────

describe("register", () => {
  test("succès — renvoie user + tokens", async () => {
    repo.findByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed");
    repo.createUser.mockResolvedValue(mockUser);

    const result = await service.register({ email: "a@a.com", password: "12345678", name: "John" });

    expect(result.user).toEqual(mockUser);
    expect(result.accessToken).toBe("access-token");
    expect(result.refreshToken).toBe("refresh-token");
    expect(jwt.signAccessToken).toHaveBeenCalledWith({ id: "1", role: "STUDENT" });
    expect(jwt.signRefreshToken).toHaveBeenCalledWith({ id: "1" });
  });

  test("échec — email déjà utilisé", async () => {
    repo.findByEmail.mockResolvedValue(mockUser);

    await expect(
      service.register({ email: "a@a.com", password: "12345678", name: "John" })
    ).rejects.toThrow("User already exists");

    expect(repo.createUser).not.toHaveBeenCalled();
  });
});

// ─── login ────────────────────────────────────────────────────────────────────

describe("login", () => {
  test("succès — credentials valides", async () => {
    repo.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const result = await service.login({ email: "a@a.com", password: "12345678" });

    expect(result.user).toEqual(mockUser);
    expect(result.accessToken).toBe("access-token");
    expect(result.refreshToken).toBe("refresh-token");
  });

  test("échec — utilisateur introuvable", async () => {
    repo.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: "unknown@a.com", password: "12345678" })
    ).rejects.toThrow("Invalid credentials");
  });

  test("échec — mot de passe incorrect", async () => {
    repo.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(
      service.login({ email: "a@a.com", password: "wrong" })
    ).rejects.toThrow("Invalid credentials");
  });
});

// ─── refresh ──────────────────────────────────────────────────────────────────

describe("refresh", () => {
  test("succès — renvoie un nouveau accessToken", async () => {
    jwt.verifyRefresh.mockReturnValue({ id: "1" });
    repo.findById.mockResolvedValue(mockUser);

    const result = await service.refresh("valid-refresh-token");

    expect(result.accessToken).toBe("access-token");
    expect(jwt.signAccessToken).toHaveBeenCalledWith({ id: "1", role: "STUDENT" });
  });

  test("échec — utilisateur supprimé depuis l'émission du token", async () => {
    jwt.verifyRefresh.mockReturnValue({ id: "999" });
    repo.findById.mockResolvedValue(null);

    await expect(service.refresh("orphan-token")).rejects.toThrow("User not found");
  });
});

// ─── me ───────────────────────────────────────────────────────────────────────

describe("me", () => {
  test("renvoie l'utilisateur correspondant à l'id", async () => {
    repo.findById.mockResolvedValue(mockUser);

    const result = await service.me("1");

    expect(result).toEqual(mockUser);
    expect(repo.findById).toHaveBeenCalledWith("1");
  });
});