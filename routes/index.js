var express = require("express");
var router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async function (req, res, next) {
  const todos = await prisma.todo.findMany();
  res.render("index", {
    title: "Express",
    todos: todos,
  });
});

module.exports = router;
