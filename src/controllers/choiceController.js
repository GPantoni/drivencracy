import { ObjectId } from "mongodb";
import db from "../database.js";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";

export async function createChoice(req, res) {
  const { title, poolId } = req.body;
  const now = dayjs().format("YYYY-MM-DD HH:mm");

  try {
    const isAPool = await db
      .collection("pools")
      .findOne({ _id: new ObjectId(poolId) });
    if (!isAPool) {
      return res.sendStatus(404);
    }

    const usedTitle = await db.collection("choices").findOne({ title });
    if (usedTitle) {
      return res.sendStatus(409);
    }

    dayjs.extend(isSameOrBefore);
    const expireDate = await db
      .collection("pools")
      .findOne({ _id: new ObjectId(poolId) });
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

export async function registerVote(req, res) {
  const choiceId = req.params;
  const now = dayjs().format("YYYY-MM-DD HH:mm");

  try {
    const isAChoice = await db
      .collection("choices")
      .findOne({ _id: new ObjectId(choiceId) });
    if (!isAChoice) {
      return res.sendStatus(404);
    }

    dayjs.extend(isSameOrBefore);
    const expireDate = await db
      .collection("pools")
      .findOne({ _id: isAChoice.poolId });
    if (dayjs(expireDate.expireAt).isSameOrBefore(dayjs(now))) {
      return res.sendStatus(403);
    }

    await db
      .collection("votes")
      .insertOne({ createdAt: now, choiceId: isAChoice._id });

    res.sendStatus(201);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}
