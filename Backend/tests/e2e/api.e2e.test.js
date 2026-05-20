import request from "supertest";
import app from "../../src/app.js";

describe("E2E API", () => {
    test("full auth flow", async() => {
        const register = await request(app)
            .post("/api/auth/register")
            .send({ email: "test@test.com", password: "12345678", name: "John" });

        expect(register.statusCode).toBe(200);

        const login = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@test.com", password: "12345678" });

        expect(login.statusCode).toBe(200);
    });
});