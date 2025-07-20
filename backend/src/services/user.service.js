import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import { findFriendRequest } from "./friendRequest.service.js";
import FriendRequest from "../models/FriendRequest.js";

export const createUser = async (userData) => {
  const { fullName, email, password } = userData;

  const hashedPassword = await bcryptjs.hash(password, 10);

  const user = await User.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
    },
  });

  return user;
};

export const getUserByEmail = async (email) => {
  const user = await User.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      password: true,
      profilePic: true,
      bio: true,
      nativeLanguage: true,
      learningLanguage: true,
      location: true,
      isOnboarded: true,
      friendIds: true,
    },
  });
  return user;
};

export const getUserById = async (id) => {
  const user = await User.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      profilePic: true,
      bio: true,
      nativeLanguage: true,
      learningLanguage: true,
      location: true,
      isOnboarded: true,
      friendIds: true,
    },
  });
  return user;
};

export const updateUser = async (id, userData) => {
  const user = await User.update({
    where: {
      id,
    },
    data: userData,
  });
  return user;
};

export const removeFriendService = async (userId, friendId) => {
  const friendRequest = await findFriendRequest(userId, friendId);
  if (friendRequest) {
    await FriendRequest.delete({
      where: {
        id: friendRequest.id,
      },
    });
  }
  // First, get the current user to access their friendIds
  const currentUser = await User.findUnique({
    where: {
      id: userId,
    },
    select: {
      friendIds: true,
    },
  });

  // Get the current friend to access their friendIds
  const currentFriend = await User.findUnique({
    where: {
      id: friendId,
    },
    select: {
      friendIds: true,
    },
  });

  // Update user's friendIds by removing the friend
  const updatedUser = await User.update({
    where: {
      id: userId,
    },
    data: {
      friendIds: {
        set: currentUser.friendIds.filter((id) => id !== friendId),
      },
    },
    select: {
      friendIds: true,
    },
  });

  // Update friend's friendIds by removing the user
  const updatedFriend = await User.update({
    where: {
      id: friendId,
    },
    data: {
      friendIds: {
        set: currentFriend.friendIds.filter((id) => id !== userId),
      },
    },
    select: {
      friendIds: true,
    },
  });

  return updatedUser;
};

export const getUserFriendsService = async (userId) => {
  try {
    const user = await User.findUnique({
      where: {
        id: userId,
      },
      select: {
        friendIds: true,
      },
    });
    const friends = await User.findMany({
      where: {
        id: {
          in: user.friendIds,
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        profilePic: true,
        bio: true,
        nativeLanguage: true,
        learningLanguage: true,
        location: true,
        isOnboarded: true,
        friendIds: true,
      },
    });
    return friends;
  } catch (error) {
    console.error("Error getting user friends:", error.message);
  }
};

export const getRecommendedUsersService = async (learningLanguage, userId) => {
  const friends = await User.findMany({
    where: {
      id: userId,
    },
    select: {
      friendIds: true,
    },
  });
  const friendIds = friends.flatMap((friend) => friend.friendIds);
  const recommendedUsers = await User.findMany({
    where: {
      id: { not: userId, notIn: friendIds },
      learningLanguage: learningLanguage,
    },
    take: 10,
    select: {
      id: true,
      fullName: true,
      profilePic: true,
      bio: true,
      nativeLanguage: true,
      learningLanguage: true,
      location: true,
    },
  });
  return recommendedUsers;
};
