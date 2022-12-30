var express = require("express");
var router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* GET home page. */
router.get("/", async function (req, res, next) {
  const todos = await prisma.todo.findMany();
  res.render("index", {
    title: "Express",
    todos: todos,
  });
});

router.post("/", async function (req, res, next) {
  let name = req.body.name;
  if (!name) {
    req.flash("error", "A name is required!");
    res.redirect("/");
    return;
  }

  const todo = await prisma.todo.create({
    data: {
      name: req.body.name,
      complete: false,
    },
  });

  req.flash("success", "New todo created!");
  res.redirect("/");
});

// router.get("/todo/:id", async function (req, res, next) {
//   let todo = await prisma.todo.findUnique({
//     where: {
//       id: +req.params.id,
//     },
//   });

//   if (!todo) {
//     next();
//     return;
//   }

//   res.render("show", { todo: todo });
// });

module.exports = router;
