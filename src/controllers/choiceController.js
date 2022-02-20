import { ObjectId } from "mongodb";
import db from "../database.js";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";

export async function createChoice(req, res) {
  const { title, poolId } = req.body;
  const now = dayjs().format("YYYY-MM-DD HH:mm");
  // console.log(now);

  try {
    const isAPool = await db
      .collection("pools")
      .findOne({ _id: new ObjectId(poolId) });
    if (!isAPool) {
      return res.sendStatus(404);
    }

    const usedTitle = await db.collection("choices").findOne({ title });
    // console.log(usedTitle);
    if (usedTitle) {
      return res.sendStatus(409);
    }

    dayjs.extend(isSameOrBefore);
    const expireDate = await db
      .collection("pools")
      .findOne({ _id: new ObjectId(poolId) });
    // console.log(expireDate);
    if (dayjs(expireDate.expireAt).isSameOrBefore(dayjs(now))) {
      return res.sendStatus(403);
    }

    await db
      .collection("choices")
      .insertOne({ title, poolId: new ObjectId(poolId) });
    res.sendStatus(201);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}
