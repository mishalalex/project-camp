import { Router } from "express";
import { registerUser } from "../controllers/auth.controller.js"
import { validate } from "../middlewares/validator.middleware.js"
import { userRegistrationValidator } from "../validators/index.js"

const router = Router();
router
    .route("/register-user")
    .post(userRegistrationValidator(), validate, registerUser)

export default router;