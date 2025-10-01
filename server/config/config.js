import { createRequire } from "module"; 
const require = createRequire(import.meta.url); 
const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient({
  log: ["query"],
});

export default prisma;