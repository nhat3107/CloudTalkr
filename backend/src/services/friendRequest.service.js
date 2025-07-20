import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export const createFriendRequest = async (senderId, recipientId) => {
  const friendRequest = await FriendRequest.create({
    data: {
      senderId,
      recipientId,
      status: "PENDING",
    },
    include: {
      sender: true,
      recipient: true,
    },
  });
  return friendRequest;
};

export const acceptFriendRequestService = async (requestId, currentUserId) => {
  const friendRequest = await FriendRequest.update({
    where: {
      id: requestId,
      recipientId: currentUserId, // Ensure the current user is the recipient
    },
    data: {
      status: "ACCEPTED",
    },
    include: {
      sender: true,
      recipient: true,
    },
  });
  await User.update({
    where: { id: currentUserId },
    data: {
      friendIds: { push: friendRequest.senderId },
    },
  });
  await User.update({
    where: { id: friendRequest.senderId },
    data: {
      friendIds: { push: currentUserId },
    },
  });
  return friendRequest;
};

export const getOutgoingFriendRequestsService = async (userId) => {
  const outgoingFriendRequests = await FriendRequest.findMany({
    where: {
      senderId: userId,
      status: "PENDING",
    },
    select: {
      id: true,
      recipient: true,
    },
  });
  return outgoingFriendRequests;
};

export const isExistingFriendRequestService = async (senderId, recipientId) => {
  const existingFriendRequest = await FriendRequest.findFirst({
    where: {
      senderId,
      recipientId,
    },
  });
  const existingFriendRequest2 = await FriendRequest.findFirst({
    where: {
      recipientId: senderId,
      senderId: recipientId,
    },
  });
  if (existingFriendRequest || existingFriendRequest2) {
    return true;
  }
  return false;
};

export const getIncomingFriendRequestsService = async (userId) => {
  const incomingFriendRequests = await FriendRequest.findMany({
    where: {
      recipientId: userId,
      status: "PENDING",
    },
    include: {
      sender: true,
    },
  });
  return incomingFriendRequests;
};

export const getAcceptedFriendRequestsService = async (userId) => {
  const acceptedFriendRequests = await FriendRequest.findMany({
    where: {
      senderId: userId,
      status: "ACCEPTED",
    },
    include: {
      recipient: true,
    },
  });
  return acceptedFriendRequests;
};

export const findFriendRequest = async (senderId, receiverId) => {
  const friendRequest = await FriendRequest.findFirst({
    where: {
      senderId,
      recipientId: receiverId,
    },
  });
  const friendRequest2 = await FriendRequest.findFirst({
    where: {
      senderId: receiverId,
      recipientId: senderId,
    },
  });
  return friendRequest ? friendRequest : friendRequest2;
};
