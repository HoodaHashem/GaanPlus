import asyncHandler from "../utils/asyncHandler.js";

export const getUserInfo = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
})
