export const signAccessToken = jest.fn(() => "access-token");
export const signRefreshToken = jest.fn(() => "refresh-token");
export const verifyAccess = jest.fn(() => ({ id: "123", role: "STUDENT" }));
export const verifyRefresh = jest.fn(() => ({ id: "123" }));