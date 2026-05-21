/**
 * role.middleware.test.js
 * Teste le middleware d'autorisation par rôle.
 * authorizeRole(['ADMIN']) doit :
 *   - laisser passer si req.user.role est dans la liste
 *   - renvoyer 403 sinon
 */
import authorizeRole from "../../../src/middlewares/role.middleware.js";

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("role.middleware", () => {
  test("rôle autorisé — appelle next()", () => {
    const middleware = authorizeRole(["ADMIN"]);
    const req = { user: { id: "1", role: "ADMIN" } };
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("plusieurs rôles autorisés — passe si le rôle est dans la liste", () => {
    const middleware = authorizeRole(["ADMIN", "STUDENT"]);
    const req = { user: { id: "2", role: "STUDENT" } };
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test("rôle non autorisé — renvoie 403", () => {
    const middleware = authorizeRole(["ADMIN"]);
    const req = { user: { id: "3", role: "STUDENT" } };
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("req.user absent (middleware auth non exécuté) — renvoie 403", () => {
    const middleware = authorizeRole(["ADMIN"]);
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("liste de rôles vide — refuse tout le monde", () => {
    const middleware = authorizeRole([]);
    const req = { user: { id: "1", role: "ADMIN" } };
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});