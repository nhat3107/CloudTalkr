import {
  getRecommendedUsersService,
  getUserFriendsService,
  removeFriendService,
} from "../services/user.service.js";
import {
  createFriendRequest,
  getOutgoingFriendRequestsService,
  acceptFriendRequestService,
  isExistingFriendRequestService,
  getIncomingFriendRequestsService,
  getAcceptedFriendRequestsService,
} from "../services/friendRequest.service.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUser = req.user;

    const recommendedUsers = await getRecommendedUsersService(
      currentUser.learningLanguage,
      currentUser.id
    );
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.error("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const users = await getUserFriendsService(req.user.id);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  const { id: recipientId } = req.params;
  const senderId = req.user.id;
  try {
    const isExistingFriendRequest = await isExistingFriendRequestService(
      senderId,
      recipientId
    );
    if (isExistingFriendRequest) {
      return res.status(400).json({ message: "Friend request already exists" });
    }
    const friendRequest = await createFriendRequest(senderId, recipientId);
    res.status(200).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  const { id: requestId } = req.params;
  const currentUserId = req.user.id;
  try {
    const friendRequest = await acceptFriendRequestService(
      requestId,
      currentUserId
    );
    res.status(200).json(friendRequest);
  } catch (error) {
    console.error("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await getIncomingFriendRequestsService(
      req.user.id
    );
    const acceptedRequests = await getAcceptedFriendRequestsService(
      req.user.id
    );
    res.status(200).json({
      incomingReqs: incomingRequests,
      acceptedReqs: acceptedRequests,
    });
  } catch (error) {
    console.error("Error in getFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await getOutgoingFriendRequestsService(
      req.user.id
    );
    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function removeFriend(req, res) {
  const { id: friendId } = req.params;
  const currentUserId = req.user.id;
  try {
    const friend = await removeFriendService(currentUserId, friendId);
    res.status(200).json(friend);
  } catch (error) {
    console.log("Error in removeFriend controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
