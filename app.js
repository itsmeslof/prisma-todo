var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var flash = require("express-flash");
var methodOverride = require("method-override");

var prismaErrorHandler = require("./errors/prisma");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var todoRouter = require("./routes/todo");

var sessionStore = new session.MemoryStore();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 60000 },
    store: sessionStore,
    secret: "secret",
    saveUninitialized: false,
    resave: false,
  })
);
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/todo", todoRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(prismaErrorHandler);

// error handler
// TODO: create a global errorHandler to handle specific cases, clean up this file a bit.
app.use(function (err, req, res, next) {
  if (err.status === 404) {
    res.status(404);
    res.render("404");
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    message: err.message || "An unhandled server error occured :(",
  });
});

module.exports = app;
