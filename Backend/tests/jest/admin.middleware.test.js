/**
 * admin.routes.test.js
 * Tests d'intégration des routes admin.
 * Routes : GET /api/admin/dashboard, /users, /users/:id, DELETE /users/:id
 * Toutes protégées par authMiddleware + authorizeRole(['ADMIN'])
 */
import request from "supertest";
import app from "../../src/app.js";
import * as jwt from "../../src/config/jwt.js";
import * as userService from "../../src/services/user.service.js";
import * as adminController from "../../src/controllers/admin.controller.js";

jest.mock("../../src/config/jwt.js");
jest.mock("../../src/services/user.service.js");

const mockUsers = [
  { id: "1", email: "a@a.com", name: "John", role: "STUDENT" },
  { id: "2", email: "b@b.com", name: "Jane", role: "ADMIN"   },
];

beforeEach(() => {
  jest.clearAllMocks();
});

// Helper : simule un token selon le rôle
const authHeader = (role = "ADMIN") => {
  jwt.verifyAccess.mockReturnValue({ id: "admin1", role });
  return { Authorization: "Bearer mock-token" };
};

// ─── GET /api/admin/dashboard ─────────────────────────────────────────────────

describe("GET /api/admin/dashboard", () => {
  test("200 — ADMIN accède au dashboard", async () => {
    const res = await request(app)
      .get("/api/admin/dashboard")
      .set(authHeader("ADMIN"));

    expect(res.statusCode).toBe(200);
  });

  test("403 — STUDENT refusé", async () => {
    const res = await request(app)
      .get("/api/admin/dashboard")
      .set(authHeader("STUDENT"));

    expect(res.statusCode).toBe(403);
  });

  test("401 — sans token", async () => {
    const res = await request(app).get("/api/admin/dashboard");

    expect(res.statusCode).toBe(401);
  });
});

// ─── GET /api/admin/users ─────────────────────────────────────────────────────

describe("GET /api/admin/users", () => {
  test("200 — renvoie la liste de tous les utilisateurs", async () => {
    userService.getAllUsers.mockResolvedValue(mockUsers);

    const res = await request(app)
      .get("/api/admin/users")
      .set(authHeader("ADMIN"));

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test("403 — STUDENT ne peut pas lister les utilisateurs", async () => {
    const res = await request(app)
      .get("/api/admin/users")
      .set(authHeader("STUDENT"));

    expect(res.statusCode).toBe(403);
  });

  test("401 — sans token", async () => {
    const res = await request(app).get("/api/admin/users");

    expect(res.statusCode).toBe(401);
  });
});

// ─── GET /api/admin/users/:id ─────────────────────────────────────────────────

describe("GET /api/admin/users/:id", () => {
  test("200 — renvoie l'utilisateur ciblé", async () => {
    userService.getUserById.mockResolvedValue(mockUsers[0]);

    const res = await request(app)
      .get("/api/admin/users/1")
      .set(authHeader("ADMIN"));

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe("1");
  });

  test("404 — utilisateur introuvable", async () => {
    userService.getUserById.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/admin/users/999")
      .set(authHeader("ADMIN"));

    expect(res.statusCode).toBe(404);
  });

  test("403 — STUDENT refusé", async () => {
    const res = await request(app)
      .get("/api/admin/users/1")
      .set(authHeader("STUDENT"));

    expect(res.statusCode).toBe(403);
  });
});

// ─── DELETE /api/admin/users/:id ──────────────────────────────────────────────

describe("DELETE /api/admin/users/:id", () => {
  test("200 — utilisateur supprimé", async () => {
    userService.deleteUser.mockResolvedValue(mockUsers[0]);

    const res = await request(app)
      .delete("/api/admin/users/1")
      .set(authHeader("ADMIN"));

    expect(res.statusCode).toBe(200);
  });

  test("404 — utilisateur introuvable", async () => {
    userService.deleteUser.mockRejectedValue(new Error("User not found"));

    const res = await request(app)
      .delete("/api/admin/users/999")
      .set(authHeader("ADMIN"));

    expect(res.statusCode).toBe(404);
  });

  test("403 — STUDENT ne peut pas supprimer", async () => {
    const res = await request(app)
      .delete("/api/admin/users/1")
      .set(authHeader("STUDENT"));

    expect(res.statusCode).toBe(403);
  });

  test("401 — sans token", async () => {
    const res = await request(app).delete("/api/admin/users/1");

    expect(res.statusCode).toBe(401);
  });
});