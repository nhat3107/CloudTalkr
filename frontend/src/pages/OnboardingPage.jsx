import { useState, useRef } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding, deleteImage, updateProfilePic } from "../lib/api";
import {
  LoaderIcon,
  MapPinIcon,
  ShipWheelIcon,
  CameraIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const [hovered, setHovered] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isImageUploadedToCloudinary, setIsImageUploadedToCloudinary] =
    useState(false);
  const fileInputRef = useRef(null);

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    onboardingMutation(formState);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState({ ...formState, profilePic: reader.result });
        setIsImageUploadedToCloudinary(false); // Reset upload status when new image is selected
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = async () => {
    if (formState.profilePic) {
      try {
        // Only call deleteImage if the image was uploaded to Cloudinary
        if (isImageUploadedToCloudinary) {
          await deleteImage(formState.profilePic);
        }
        setFormState({ ...formState, profilePic: "" });
        setIsImageUploadedToCloudinary(false);
        // Reset the file input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        toast.error("Failed to delete image");
      }
    }
  };

  const handleUploadToCloudinary = async () => {
    if (!formState.profilePic) return;
    setUploading(true);
    try {
      const secureUrl = await updateProfilePic(formState);
      if (secureUrl) {
        setFormState({ ...formState, profilePic: secureUrl });
        setIsImageUploadedToCloudinary(true); // Mark as uploaded to Cloudinary
        toast.success("Image uploaded to Cloudinary!");
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2000);
      } else {
        toast.error("Cloudinary upload failed");
      }
    } catch (err) {
      toast.error("Cloudinary upload error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div
                className="size-32 rounded-full bg-base-300 overflow-hidden relative group"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {formState.profilePic ? (
                  <>
                    <img
                      src={formState.profilePic}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                    {uploadSuccess && (
                      <div className="absolute top-2 right-2 bg-success text-white rounded-full p-1 flex items-center justify-center z-10 animate-fade-in">
                        <CheckIcon className="size-5" />
                        <span className="ml-1 text-xs font-semibold">
                          Uploaded
                        </span>
                      </div>
                    )}
                    {hovered && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3">
                        <button
                          type="button"
                          className="btn btn-success btn-sm rounded-full"
                          onClick={handleUploadToCloudinary}
                          disabled={uploading}
                          title="Upload to Cloudinary"
                        >
                          <CheckIcon className="size-6" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-error btn-sm rounded-full"
                          onClick={handleRemoveImage}
                          title="Remove image"
                        >
                          <XIcon className="size-6" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              {/* Upload Image BTN */}
              <label className="btn btn-outline cursor-pointer">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                Upload Image
              </label>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* LANGUAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NATIVE LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* LEARNING LANGUAGE */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}

            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default OnboardingPage;
