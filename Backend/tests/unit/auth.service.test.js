import * as service from "../../src/services/auth.service.js";
import * as repo from "../../src/repositories/auth.repository.js";
import * as jwt from "../../src/config/jwt.js";
import bcrypt from "bcrypt";

jest.mock("../../src/repositories/auth.repository.js");
jest.mock("../../src/config/jwt.js");
jest.mock("bcrypt");

describe("Auth Service", () => {
    test("register - success", async() => {
        repo.findByEmail.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue("hashed");
        repo.createUser.mockResolvedValue({ id: "1", email: "a@a.com", role: "STUDENT" });

        const result = await service.register({
            email: "a@a.com",
            password: "12345678",
            name: "John",
        });

        expect(result.user).toBeDefined();
        expect(jwt.signAccessToken).toHaveBeenCalled();
        expect(jwt.signRefreshToken).toHaveBeenCalled();
    });

    test("register - user exists", async() => {
        repo.findByEmail.mockResolvedValue({ id: "1" });

        await expect(
            service.register({ email: "a@a.com", password: "12345678", name: "John" })
        ).rejects.toThrow("User already exists");
    });
});