import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  throw new ApiError(401, "Unauthorized request");
});
