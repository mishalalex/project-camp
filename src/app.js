import express from "express";

const app = express();

import healthCheckRouter from "./routes/healthCheck.route.js";

app.use("/api/v1/healthcheck", healthCheckRouter);

export default app;