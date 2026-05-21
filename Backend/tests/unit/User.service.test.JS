/**
 * user.service.test.js
 * Couvre toutes les fonctions de user.service.js :
 * getUserById, getUserByEmail, createNewUser, updateUser, deleteUser, getAllUsers
 */
import * as service from "../../src/services/user.service.js";
import * as repo from "../../src/repositories/auth.repository.js";

jest.mock("../../src/repositories/auth.repository.js");

const mockUser = { id: "1", email: "a@a.com", name: "John", role: "STUDENT" };
const mockUser2 = { id: "2", email: "b@b.com", name: "Jane", role: "ADMIN" };

beforeEach(() => jest.clearAllMocks());

// ─── getUserById ──────────────────────────────────────────────────────────────

describe("getUserById", () => {
  test("renvoie l'utilisateur si trouvé", async () => {
    repo.findById.mockResolvedValue(mockUser);

    const result = await service.getUserById("1");

    expect(repo.findById).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockUser);
  });

  test("renvoie null si l'utilisateur n'existe pas", async () => {
    repo.findById.mockResolvedValue(null);

    const result = await service.getUserById("999");

    expect(result).toBeNull();
  });
});

// ─── getUserByEmail ───────────────────────────────────────────────────────────

describe("getUserByEmail", () => {
  test("renvoie l'utilisateur correspondant à l'email", async () => {
    repo.findByEmail.mockResolvedValue(mockUser);

    const result = await service.getUserByEmail("a@a.com");

    expect(repo.findByEmail).toHaveBeenCalledWith("a@a.com");
    expect(result).toEqual(mockUser);
  });

  test("renvoie null si email inconnu", async () => {
    repo.findByEmail.mockResolvedValue(null);

    const result = await service.getUserByEmail("unknown@x.com");

    expect(result).toBeNull();
  });
});

// ─── createNewUser ────────────────────────────────────────────────────────────

describe("createNewUser", () => {
  test("succès — email libre, crée l'utilisateur", async () => {
    repo.findByEmail.mockResolvedValue(null);
    repo.createUser.mockResolvedValue(mockUser);

    const result = await service.createNewUser({
      email: "a@a.com",
      name: "John",
      password: "hashed",
      role: "STUDENT",
    });

    expect(repo.createUser).toHaveBeenCalled();
    expect(result).toEqual(mockUser);
  });

  test("échec — email déjà utilisé", async () => {
    repo.findByEmail.mockResolvedValue(mockUser);

    await expect(
      service.createNewUser({ email: "a@a.com", name: "John", password: "hashed" })
    ).rejects.toThrow("Email already in use");

    expect(repo.createUser).not.toHaveBeenCalled();
  });
});

// ─── updateUser ───────────────────────────────────────────────────────────────

describe("updateUser", () => {
  test("succès — utilisateur trouvé, données mises à jour", async () => {
    const updated = { ...mockUser, name: "John Updated" };
    repo.findById.mockResolvedValue(mockUser);
    repo.updateUser.mockResolvedValue(updated);

    const result = await service.updateUser("1", { name: "John Updated" });

    expect(repo.findById).toHaveBeenCalledWith("1");
    expect(repo.updateUser).toHaveBeenCalledWith("1", { name: "John Updated" });
    expect(result.name).toBe("John Updated");
  });

  test("échec — utilisateur introuvable", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.updateUser("999", { name: "X" })).rejects.toThrow("User not found");

    expect(repo.updateUser).not.toHaveBeenCalled();
  });
});

// ─── deleteUser ───────────────────────────────────────────────────────────────

describe("deleteUser", () => {
  test("succès — utilisateur trouvé et supprimé", async () => {
    repo.findById.mockResolvedValue(mockUser);
    repo.deleteUser.mockResolvedValue(mockUser);

    const result = await service.deleteUser("1");

    expect(repo.findById).toHaveBeenCalledWith("1");
    expect(repo.deleteUser).toHaveBeenCalledWith("1");
    expect(result).toEqual(mockUser);
  });

  test("échec — utilisateur introuvable", async () => {
    repo.findById.mockResolvedValue(null);

    await expect(service.deleteUser("999")).rejects.toThrow("User not found");

    expect(repo.deleteUser).not.toHaveBeenCalled();
  });
});

// ─── getAllUsers ──────────────────────────────────────────────────────────────

describe("getAllUsers", () => {
  test("renvoie la liste filtrée (sans password, sans champs sensibles)", async () => {
    const rawUsers = [
      { ...mockUser,  password: "hashed1" },
      { ...mockUser2, password: "hashed2" },
    ];
    repo.getAllUsers.mockResolvedValue(rawUsers);

    const result = await service.getAllUsers("admin1");

    expect(repo.getAllUsers).toHaveBeenCalledWith("admin1");
    // Le service mappe et expose : id, email, name, role uniquement
    expect(result).toEqual([
      { id: "1", email: "a@a.com", name: "John",  role: "STUDENT" },
      { id: "2", email: "b@b.com", name: "Jane", role: "ADMIN"   },
    ]);
    // Aucun password ne doit fuiter
    result.forEach((u) => expect(u.password).toBeUndefined());
  });

  test("renvoie un tableau vide si aucun utilisateur", async () => {
    repo.getAllUsers.mockResolvedValue([]);

    const result = await service.getAllUsers("admin1");

    expect(result).toEqual([]);
  });
});