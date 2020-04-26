const express = require("express");

const db = require("../data/dbConfig.js");

const server = express();

server.use(express.json());

server.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({
    message: "Something went wrong",
  });
});

server.get("/accounts", async (req, res, next) => {
  try {
    const accounts = await db("accounts").select("*");
    res.json(accounts);
  } catch (err) {
    next(err);
  }
});

server.get("/accounts/:id", async (req, res, next) => {
  try {
    const account = await db("accounts").first().where("id", req.params.id);
    res.json(account);
  } catch (err) {
    next(err);
  }
});

server.put("/accounts/:id", async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      budget: req.body.budget,
    };

    await db("accounts").where("id", req.params.id).update(payload);
    const updatedAccount = await db("accounts")
      .where("id", req.params.id)
      .first();

    res.json(updatedAccount);
  } catch (err) {
    next(err);
  }
});

server.post("/accounts", async (req, res, next) => {
  try {
    const payload = {
      name: req.body.name,
      budget: req.body.budget,
    };

    const [id] = await db("accounts").insert(payload);
    const account = await db("accounts").where("id", id).first();

    res.json(account);
  } catch (err) {
    next(err);
  }
});

server.delete("/accounts/:id", async (req, res, next) => {
  try {
    await db("accounts").where("id", req.params.id).del();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = server;
