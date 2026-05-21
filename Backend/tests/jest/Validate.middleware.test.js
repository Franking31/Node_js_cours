/**
 * validate.middleware.test.js
 * Teste le middleware de validation Zod.
 * validate(schema) doit :
 *   - appeler next() si req.body est valide
 *   - renvoyer 400 avec les erreurs si invalide
 */
import validate from "../../../src/middlewares/validate.middleware.js";
import { z } from "zod";

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Schéma simple pour les tests
const testSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

describe("validate.middleware", () => {
  test("body valide — appelle next() sans modifier req.body", () => {
    const middleware = validate(testSchema);
    const body = { email: "a@a.com", password: "12345678", name: "John" };
    const req = { body };
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("email invalide — renvoie 400", () => {
    const middleware = validate(testSchema);
    const req = { body: { email: "not-an-email", password: "12345678", name: "John" } };
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("mot de passe trop court — renvoie 400", () => {
    const middleware = validate(testSchema);
    const req = { body: { email: "a@a.com", password: "123", name: "John" } };
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("champ manquant — renvoie 400", () => {
    const middleware = validate(testSchema);
    const req = { body: { email: "a@a.com" } }; // password et name manquants
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  test("body vide — renvoie 400", () => {
    const middleware = validate(testSchema);
    const req = { body: {} };
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });

  test("les données parsées par Zod sont injectées dans req.body (strip des champs extra)", () => {
    const middleware = validate(testSchema);
    const req = {
      body: { email: "a@a.com", password: "12345678", name: "John", extraField: "injecté" },
    };
    const res = mockRes();
    const next = jest.fn();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    // Zod strip par défaut — le champ extra ne doit pas être dans req.body
    expect(req.body.extraField).toBeUndefined();
  });
});