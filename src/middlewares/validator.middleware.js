import { validationResult } from "express-validator"
import { ApiError } from "../utils/api-errors.js"

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }

    const extractedErrors = [];
    // errors.array() = just an extra step to make sure the 'errors' array is an array
    // why? to make debugging easier later
    errors.array().map((eachError) => extractedErrors.push({
        [eachError.path]: eachError.msg
    }))

    throw new ApiError(400, "Received data is not valid", extractedErrors);

}