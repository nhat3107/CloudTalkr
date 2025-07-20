import express from "express";
import {
  login,
  logout,
  onboard,
  signup,
  signUpload,
  deleteImage,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);
router.post("/sign-upload", protectRoute, signUpload);
router.post("/delete-image", protectRoute, deleteImage);

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
