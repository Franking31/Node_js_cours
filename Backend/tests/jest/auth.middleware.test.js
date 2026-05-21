/**
 * auth.middleware.test.js
 * Teste le middleware d'authentification JWT.
 * Le middleware doit : lire le header Authorization, vérifier le token,
 * injecter req.user, et renvoyer 401 si invalide.
 */
import authMiddleware from "../../../src/middlewares/auth.middleware.js";
import * as jwt from "../../../src/config/jwt.js";

jest.mock("../../../src/config/jwt.js");

// Helpers
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = () => jest.fn();

describe("auth.middleware", () => {
  beforeEach(() => jest.clearAllMocks());

  test("token valide — injecte req.user et appelle next()", () => {
    jwt.verifyAccess.mockReturnValue({ id: "1", role: "STUDENT" });

    const req = { headers: { authorization: "Bearer valid-token" } };
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(jwt.verifyAccess).toHaveBeenCalledWith("valid-token");
    expect(req.user).toEqual({ id: "1", role: "STUDENT" });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("header Authorization absent — renvoie 401", () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("header présent sans préfixe Bearer — renvoie 401", () => {
    const req = { headers: { authorization: "just-a-token" } };
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("token expiré / invalide — verifyAccess lance une erreur → renvoie 401", () => {
    jwt.verifyAccess.mockImplementation(() => {
      throw new Error("jwt expired");
    });

    const req = { headers: { authorization: "Bearer expired-token" } };
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test("token malformé — renvoie 401", () => {
    jwt.verifyAccess.mockImplementation(() => {
      throw new Error("invalid token");
    });

    const req = { headers: { authorization: "Bearer not.a.valid.jwt" } };
    const res = mockRes();
    const next = mockNext();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});