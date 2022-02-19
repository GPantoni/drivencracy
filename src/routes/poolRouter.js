import { Router } from "express";
import { validatePoolSchema } from "../middlewares/validatePoolSchema.js";
import { createPool, listPools } from "../controllers/poolController.js";

const poolRouter = Router();

poolRouter.post("/pool", validatePoolSchema, createPool);
poolRouter.get("/pool", listPools);

export default poolRouter;
