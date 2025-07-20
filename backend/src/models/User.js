import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const User = prisma.user;

export default User;
