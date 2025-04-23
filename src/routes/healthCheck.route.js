import { Router } from "express";
import { healthCheckController } from "../controllers/healthCheck.controller.js";

const healthCheckRouter = Router();
healthCheckRouter.route("/").get(healthCheckController)

export default healthCheckRouter;