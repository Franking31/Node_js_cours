import request from "supertest";
import app from "../../src/app.js";
import * as repo from "../../src/repositories/auth.repository.js";
import * as jwt from "../../src/config/jwt.js";
import bcrypt from "bcrypt";

jest.mock("../../src/repositories/auth.repository.js");
jest.mock("../../src/config/jwt.js");
jest.mock("bcrypt");

describe("Auth Routes", () => {
    test("POST /api/auth/register", async() => {
        repo.findByEmail.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue("hashed");
        repo.createUser.mockResolvedValue({ id: "1", email: "a@a.com" });

        const res = await request(app)
            .post("/api/auth/register")
            .send({ email: "a@a.com", password: "12345678", name: "John" });

        expect(res.statusCode).toBe(200);
        expect(res.body.user).toBeDefined();
    });
});