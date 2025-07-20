import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { LANGUAGE_TO_FLAG } from "../constants";
import { removeFriend } from "../lib/api";
import toast from "react-hot-toast";

const RemoveFriendCard = ({ friend }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: removeFriendMutation } = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      toast.success("Friend removed successfully");
      setShowConfirmDialog(false);
      // Invalidate both query keys to refresh the friends list
      queryClient.invalidateQueries({ queryKey: ["user-friends"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (error) => {
      if (error.response?.status === 400 || error.response?.status === 500) {
        toast.error(error.response?.data?.message || "Failed to remove friend");
      }
      setShowConfirmDialog(false);
    },
  });

  return (
    <>
      <div className="card bg-base-200 hover:shadow-md transition-shadow">
        <div className="card-body p-4">
          {/* USER INFO */}
          <div className="flex items-center gap-3 mb-3">
            <div className="avatar size-12">
              <img src={friend.profilePic || null} alt={friend.fullName} />
            </div>
            <h3 className="font-semibold truncate">{friend.fullName}</h3>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            <span key="native" className="badge badge-secondary text-xs">
              {getLanguageFlag(friend.nativeLanguage)}
              Native: {friend.nativeLanguage}
            </span>
            <span key="learning" className="badge badge-outline text-xs">
              {getLanguageFlag(friend.learningLanguage)}
              Learning: {friend.learningLanguage}
            </span>
          </div>

          <button
            className="btn btn-error btn-sm w-full"
            onClick={() => setShowConfirmDialog(true)}
          >
            Remove Friend
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Remove Friend</h3>
            <p className="mb-6">
              Are you sure you want to remove <strong>{friend.fullName}</strong>{" "}
              from your friends list? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-error"
                onClick={() => removeFriendMutation(friend.id)}
              >
                Remove Friend
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default RemoveFriendCard;

export function getLanguageFlag(language) {
  if (!language) return null;

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (countryCode) {
    return (
      <img
        src={`https://flagcdn.com/24x18/${countryCode}.png`}
        alt={`${langLower} flag`}
        className="h-3 mr-1 inline-block"
      />
    );
  }
  return null;
}
