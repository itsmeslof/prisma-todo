var express = require("express");
var router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async function (req, res, next) {
  let name = req.body.name;
  if (!name) {
    req.flash("error", "A name is required!");
    res.redirect("/");
    return;
  }

  try {
    await prisma.todo.create({
      data: {
        name: req.body.name,
        complete: false,
      },
    });
  } catch (e) {
    req.flash("error", "There was an error creating the todo :(");
    res.redirect("/");
    return;
  }

  req.flash("success", "New todo created!");
  res.redirect("/");
});

router.patch("/:id", async function (req, res, next) {
  let todo = {};
  const complete = !!+req.body.complete; // this is *still* nasty D: I should fix this with proper validation
  try {
    todo = await prisma.todo.update({
      where: {
        id: +req.params.id,
      },
      data: {
        complete: complete,
      },
    });
  } catch (e) {
    req.flash("error", "There was an error updating the todo :(");
    res.redirect("/");
    return;
  }

  req.flash("success", `Todo ${todo.name} updated!`);
  res.redirect("/");
});

module.exports = router;
