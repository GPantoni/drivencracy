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
  // console.log(pool);

  try {
    await db.collection("pools").insertOne(pool);
    res.sendStatus(201);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}

export async function listPools(req, res) {
  try {
    const pools = await db.collection("pools").find({}).toArray();
    res.send(pools);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}

export async function listPoolChoices(req, res) {
  const { id } = req.params;
  // console.log(id);

  try {
    const pool = await db
      .collection("pools")
      .findOne({ _id: new ObjectId(id) });
    if (!pool) {
      return res.sendStatus(404);
    }

    const poolChoices = await db
      .collection("choices")
      .find({ poolId: new ObjectId(id) })
      .toArray();
    // console.log(poolChoices);
    return res.send(poolChoices);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}

export async function poolResult(req, res) {
  const { id } = req.params;
  let mostVotedChoice = {
    title: "Nenhuma opção recebeu votos",
    votes: 0,
  };

  try {
    const isAPool = await db
      .collection("pools")
      .findOne({ _id: new ObjectId(id) });
    if (!isAPool) {
      return res.sendStatus(404);
    }

    const poolChoices = await db
      .collection("choices")
      .find({ poolId: isAPool._id })
      .toArray();
    // console.log(poolChoices);
    // poolChoices.forEach(async (choice) => {
    for (const choice of poolChoices) {
      // console.log(choice);
      const votes = await db
        .collection("votes")
        .find({ choiceId: choice._id })
        .toArray();
      console.log(choice.title);
      console.log(votes.length);
      console.log(mostVotedChoice.votes);
      if (votes.length > mostVotedChoice.votes) {
        mostVotedChoice.title = choice.title;
        mostVotedChoice.votes = votes.length;
      }
    }
    console.log(mostVotedChoice);

    const result = {
      ...isAPool,
      result: { ...mostVotedChoice },
    };

    res.status(200).send(result);
  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
}
