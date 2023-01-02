const errorHandler = (err, req, res, next) => {
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
};

module.exports = errorHandler;
