import { axiosInstance } from "./axios";
import axios from "axios";

const cloudinaryAxios = axios.create({
  withCredentials: false, // Don't send credentials for Cloudinary
});

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;
};

export async function getUserFriends() {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
}

export async function getRecommendedUsers() {
  const response = await axiosInstance.get("/users");
  return response.data;
}

export async function getOutgoingFriendReqs() {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
}

export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}

export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(
    `/users/friend-request/${requestId}/accept`
  );
  return response.data;
}

export async function getStreamToken() {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export async function signUpload() {
  const response = await axiosInstance.post("/auth/sign-upload");
  return response.data;
}

export async function updateProfilePic(formData) {
  if (!formData) {
    return { success: false, message: "Profile picture is required" };
  }

  const response = await signUpload();
  const { timestamp, signature, apiKey, cloudName } = response;

  const uploadFormData = new FormData();
  uploadFormData.append("file", formData.profilePic);
  uploadFormData.append("api_key", apiKey);
  uploadFormData.append("timestamp", timestamp);
  uploadFormData.append("signature", signature);
  uploadFormData.append("cloud_name", cloudName);

  const uploadResponse = await cloudinaryAxios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    uploadFormData
  );
  const { secure_url } = uploadResponse.data;
  return secure_url;
}

export async function deleteImage(profilePic) {
  const response = await axiosInstance.post("/auth/delete-image", {
    profilePic,
  });
  return response.data;
}

export async function removeFriend(friendId) {
  const response = await axiosInstance.delete(`/users/friend/${friendId}`);
  return response.data;
}
