import { asyncHandler } from "../utils/asyncHandler.js";
import { userRegistrationValidator } from "../validators/index.js";

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body
})
export { registerUser };