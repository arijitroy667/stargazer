import re

file_path = r"c:\Users\ariji\Desktop\github\stargazer-social-galaxy\backend\src\controllers\user.controller.js"

with open(file_path, "r") as f:
    content = f.read()

# Remove jwt import
content = re.sub(r'import jwt from "jsonwebtoken";\n', "", content)

# Remove generateAccessAndRefreshToken
content = re.sub(r'const generateAccessAndRefreshToken = async.*?};\n', "", content, flags=re.DOTALL)

# Remove registerUser
content = re.sub(r'const registerUser = asyncHandler\(async \(req, res\) => \{.*?\n\}\);\n', "", content, flags=re.DOTALL)

# Remove loginUser
content = re.sub(r'const loginUser = asyncHandler\(async \(req, res\) => \{.*?\n\}\);\n', "", content, flags=re.DOTALL)

# Remove refreshAccessToken
content = re.sub(r'const refreshAccessToken = asyncHandler\(async \(req, res\) => \{.*?\n\}\);\n', "", content, flags=re.DOTALL)

# Remove changeCurrentPassword
content = re.sub(r'const changeCurrentPassword = asyncHandler\(async \(req, res\) => \{.*?\n\}\);\n', "", content, flags=re.DOTALL)

# Update logoutUser
new_logout = """const logoutUser = asyncHandler(async (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json(new ApiResponse(500, {}, "Error logging out"));
    }
    return res.status(200).json(new ApiResponse(200, {}, "User logged out successfully"));
  });
});
"""
content = re.sub(r'const logoutUser = asyncHandler\(async \(req, res\) => \{.*?\n\}\);\n', new_logout, content, flags=re.DOTALL)

# Update exports
content = re.sub(r'  registerUser,\n  loginUser,\n', '', content)
content = re.sub(r'  changeCurrentPassword,\n', '', content)
content = re.sub(r'  refreshAccessToken,\n', '', content)

# Remove remaining select("-password -refreshToken") if any
content = content.replace('.select(\n    "-password -refreshToken"\n  )', '')
content = content.replace('.select("-password -refreshToken")', '')

with open(file_path, "w") as f:
    f.write(content)
