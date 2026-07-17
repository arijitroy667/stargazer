import { Router } from "express";
import passport from "passport";
import {
  getCurrentUser,
  getUserChannelProfile,
  getUserChannelProfileById,
  getWatchHistory,
  logoutUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getAllUsers,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "http://localhost:8080/",
  failureRedirect: "http://localhost:8080/",
}));

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);  

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

router.route("/allUsers").get(getAllUsers);

router.route("/public-profile/:userId").get(getUserChannelProfileById);

router.route("/history").get(verifyJWT, getWatchHistory);

export default router;
