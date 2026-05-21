// jwt.mock.js — mock complet du module jwt
export const signAccessToken = jest.fn(() => "access-token");
export const signRefreshToken = jest.fn(() => "refresh-token");
export const verifyAccess = jest.fn(() => ({ id: "1", role: "STUDENT" }));
export const verifyRefresh = jest.fn(() => ({ id: "1" }));