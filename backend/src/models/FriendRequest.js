import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

const FriendRequest = prisma.friendRequest;

export default FriendRequest;
