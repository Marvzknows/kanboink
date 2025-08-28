import { PrismaClient } from "./generated/prisma";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();
//   new PrismaClient({
//     log: ["query"], // optional: useful for debugging queries
//   });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
