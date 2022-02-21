import { Router } from "express";
import { validatePoolSchema } from "../middlewares/validatePoolSchema.js";
import {
  createPool,
  listPools,
  listPoolChoices,
  poolResult,
} from "../controllers/poolController.js";

const poolRouter = Router();

poolRouter.post("/pool", validatePoolSchema, createPool);
poolRouter.get("/pool", listPools);
poolRouter.get("/pool/:id/choice", listPoolChoices);
poolRouter.get("/pool/:id/result", poolResult);

export default poolRouter;
