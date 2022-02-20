import { Router } from "express";
import { validateChoiceSchema } from "../middlewares/validateChoiceSchema.js";
import { createChoice } from "../controllers/choiceController.js";

const choiceRouter = Router();

choiceRouter.post("/choice", validateChoiceSchema, createChoice);

export default choiceRouter;
