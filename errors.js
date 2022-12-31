const { Prisma } = require("@prisma/client");

const prismaExceptionTypes = [Prisma.PrismaClientKnownRequestError];

const errorMessages = {
  404: "404 - Page not found",
  500: "500 - An internal server error occured",
};

const isPrismaClientError = (e) => {
  for (const type of prismaExceptionTypes) {
    if (e instanceof type) {
      return true;
    }
  }

  return false;
};

const handlePrismaClientError = (err, req, res, next) => {
  switch (true) {
    case err instanceof Prisma.PrismaClientKnownRequestError:
      handlePrismaClientKnownRequestError(err, req, res, next);
      break;
    default:
      res.render("error", { message: errorMessages[500] });
      res.end();
  }
};

const handlePrismaClientKnownRequestError = (err, req, res, next) => {
  let message = errorMessages[500];
  switch (err.code || "-1") {
    case "P2025":
      message = "404 - Page not found";
      break;
    default:
      message = "Default error message";
  }

  res.render("error", { message: message });
};

module.exports = {
  isPrismaClientError,
  handlePrismaClientError,
  errorMessages,
};
