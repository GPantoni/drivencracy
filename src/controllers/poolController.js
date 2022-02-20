import db from "../database.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function createPool(req, res) {
  let pool = req.body;
  const expireDate = dayjs().add(30, "day").format("YYYY-MM-DD HH:mm");

  if (!pool.expireAt || pool.expireAt === "") {
    pool = {
      ...pool,
      expireAt: expireDate,
    };
  }

  console.log(pool);

  try {
    await db.collection("pools").insertOne(pool);
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function listPools(req, res) {
  try {
    const pools = await db.collection("pools").find({}).toArray();
    res.send(pools);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

export async function listPoolChoices(req, res) {
  const { id } = req.params;
  // console.log(id);

  const pool = await db.collection("pools").findOne({ _id: new ObjectId(id) });
  if (!pool) {
    return res.sendStatus(404);
  }

  try {
    const poolChoices = await db
      .collection("choices")
      .find({ poolId: id })
      .toArray();
    // console.log(poolChoices);
    return res.send(poolChoices);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
