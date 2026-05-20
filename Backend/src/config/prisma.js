import { PrismaClient } from "@prisma/client";

let prisma;

if (process.env.NODE_ENV === "test") {
    const mock = await
    import ("../../Tests/setup/prisma.mock.js");
    prisma = mock.default;
} else {
    prisma = new PrismaClient();
}

export default prisma;