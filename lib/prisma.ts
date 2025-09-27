import { PrismaClient } from "./generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate());
//   new PrismaClient({
//     log: ["query"], // optional: useful for debugging queries
//   });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
