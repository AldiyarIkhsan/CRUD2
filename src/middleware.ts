import { Request, Response, NextFunction } from "express";
import { Result, ValidationError, validationResult, check } from "express-validator";

// Basic Auth Middleware
export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") return next();
  if (req.method === "DELETE" && req.path === "/testing/all-data") return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) return res.sendStatus(401);

  const base64 = authHeader.split(" ")[1];
  const decoded = Buffer.from(base64, "base64").toString();
  const [login, password] = decoded.split(":");

  if (login !== "admin" || password !== "qwerty") return res.sendStatus(401);

  next();
};

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
  const result: Result<ValidationError> = validationResult(req);
  if (!result.isEmpty()) {
    const formattedErrors = result.array({ onlyFirstError: true }).map((err) => ({
      message: err.msg,
      field: (err as any).param, // безопасно для тестов
    }));

    return res.status(400).json({ errorsMessages: formattedErrors });
  }
  next();
};

// Blog validation rules
export const blogValidationRules = [
  check("name").trim().isLength({ min: 1, max: 15 }).withMessage("Name should be between 1 and 15 characters"),
  check("description")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Description is required and should be max 100 characters"),
  check("websiteUrl")
    .trim()
    .isLength({ max: 100 })
    .withMessage("Website URL is too long")
    .isURL()
    .withMessage("Website URL should be a valid URL"),
];
