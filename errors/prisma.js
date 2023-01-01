var createError = require("http-errors");
const { Prisma } = require("@prisma/client");

const prismaExceptionTypes = [
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientValidationError,
];

const isPrismaError = (err) => {
  for (const type of prismaExceptionTypes) {
    if (err instanceof type) {
      return true;
    }
  }

  return false;
};

/**
 * Prisma Client throws a PrismaClientKnownRequestError exception if the
 * query engine returns a known error related to the request - for example,
 * a unique constraint violation.
 */
const handlePrismaClientKnownRequestError = (err, req, res, next) => {
  switch (err.code) {
    /**
     * P2025
     * "An operation failed because it depends on one or more records
     * that were required but not found."
     */
    case "P2025":
      if (req.app.get("env") === "development") {
        next(createError(500, "Prisma error: Model not found"));
        return;
      }
      next(createError(404));
      return;
    default:
      next(err);
  }
};

const prismaErrorHandler = (err, req, res, next) => {
  if (!isPrismaError(err)) {
    next(err);
    return;
  }

  switch (true) {
    case err instanceof Prisma.PrismaClientKnownRequestError:
      handlePrismaClientKnownRequestError(err, req, res, next);
      return;
    default:
      next(createError(500, "Unhandled Prisma error"));
  }
};

module.exports = prismaErrorHandler;
