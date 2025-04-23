import { body } from 'express-validator';

const userRegistrationValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email required for registration")
            .isEmail().withMessage("Email should be valid"),
        body("username")
            .trim()
            .notEmpty().withMessage("Username required for registration")
            .isLength({ min: 3 }).withMessage("username must be of 3 characters minimum")
            .isLength({ max: 15 }).withMessage("username must be of 15 characters maximum")
    ]
}

const loginValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email required for login"),
        body("password")
            .notEmpty().withMessage("Password required for login")
    ]
}

export {
    userRegistrationValidator, loginValidator
}