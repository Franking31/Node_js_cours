import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });
process.env.JWT_SECRET = "test-secret";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret";
process.env.DATABASE_URL = "postgres://test-db-url";