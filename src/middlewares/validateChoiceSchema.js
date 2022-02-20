import choiceSchema from "../schemas/choiceSchema.js";

export function validateChoiceSchema(req, res, next) {
  const choice = req.body;

  const validation = choiceSchema.validate(choice);

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(422);
  }

  next();
}
