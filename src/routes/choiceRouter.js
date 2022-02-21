import { Router } from "express";
import { validateChoiceSchema } from "../middlewares/validateChoiceSchema.js";
import { createChoice, registerVote } from "../controllers/choiceController.js";

const choiceRouter = Router();

choiceRouter.post("/choice", validateChoiceSchema, createChoice);
choiceRouter.post("/choice/:id/vote", registerVote);

export default choiceRouter;
