import poolSchema from "../schemas/poolSchema.js";

export function validatePoolSchema(req, res, next) {
  const pool = req.body;

  const validation = poolSchema.validate(pool);

  if (validation.error) {
    console.log(validation.error.details);
    return res.sendStatus(422);
  }

  next();
}
