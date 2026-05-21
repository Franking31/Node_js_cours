import request from "supertest";
import app from "../../src/app.js";
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
  // verifyAccess utilisé par authMiddleware
  jwt.verifyAccess.mockReturnValue({ id: "1", role: "STUDENT" });
});

// ─── POST /api/auth/register ──────────────────────────────────────────────────

describe("POST /api/auth/register", () => {
  test("201 — inscription réussie", async () => {
    repo.findByEmail.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed");
    repo.createUser.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "a@a.com", password: "12345678", name: "John" });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.accessToken).toBe("access-token");
  });

  test("400/409 — email déjà utilisé", async () => {
    repo.findByEmail.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "a@a.com", password: "12345678", name: "John" });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test("400 — body invalide (champ manquant)", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "a@a.com" }); // password et name manquants

    expect(res.statusCode).toBe(400);
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

describe("POST /api/auth/login", () => {
  test("200 — connexion réussie", async () => {
    repo.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "a@a.com", password: "12345678" });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBe("access-token");
  });

  test("401/400 — mot de passe incorrect", async () => {
    repo.findByEmail.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "a@a.com", password: "wrong" });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  test("401/400 — utilisateur inconnu", async () => {
    repo.findByEmail.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "unknown@a.com", password: "12345678" });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────

describe("POST /api/auth/refresh", () => {
  test("200 — renvoie un nouveau accessToken", async () => {
    jwt.verifyRefresh.mockReturnValue({ id: "1" });
    repo.findById.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/auth/refresh")
      .send({ refreshToken: "valid-refresh-token" });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

describe("GET /api/auth/me", () => {
  test("200 — renvoie le profil de l'utilisateur connecté", async () => {
    repo.findById.mockResolvedValue(mockUser);

    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer access-token");

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
  });

  test("401 — sans token", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.statusCode).toBe(401);
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────

describe("POST /api/auth/logout", () => {
  test("200 — déconnexion réussie (token valide requis)", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", "Bearer access-token");

    expect(res.statusCode).toBe(200);
  });

  test("401 — sans token", async () => {
    const res = await request(app).post("/api/auth/logout");

    expect(res.statusCode).toBe(401);
  });
});