import express from "express";
import animalRoutes from "./routes/animalRoutes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

// Routes
app.use("/api/animals", animalRoutes);

// Global error handler
app.use(errorHandler);

export default app;
