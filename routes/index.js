var express = require("express");
var router = express.Router();

const { PrismaClient } = require("@prisma/client");
const {
  NotFoundError,
  PrismaClientKnownRequestError,
} = require("@prisma/client/runtime");
const prisma = new PrismaClient();

/* GET home page. */
router.get("/", async function (req, res, next) {
  let _todos = await prisma.todo.findMany();
  res.render("index", { title: "Express", todos: _todos });
});

router.get("/todo/:id", async function (req, res, next) {
  let todo = await prisma.todo.findUnique({
    where: {
      id: +req.params.id,
    },
  });

  if (!todo) {
    res.json({ status: 404 });
  }

  res.render("show", { todo: todo });
});

module.exports = router;
