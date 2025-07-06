import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError, check } from "express-validator";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") return next();
  
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send();
  }

  const base64 = authHeader.split(" ")[1];
  const decoded = Buffer.from(base64, "base64").toString();
  const [login, password] = decoded.split(":");

  if (login !== "admin" || password !== "qwerty") {
    return res.status(401).send();
  }

  next();
};

export const blogValidationRules = [
  check("name")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Name is required and should be max 30 characters"),

  check("description")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Description is required and should be max 100 characters"),

  check("websiteUrl")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Website URL is required and should be max 100 characters")
    .isURL()
    .withMessage("Website URL should be a valid URL"),
];

export const postValidationRules = [
  check("title").trim().isLength({ min: 1, max: 30 }).withMessage("Title is required and should be max 30 characters"),
  check("shortDescription")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Short description is required and should be max 100 characters"),
  check("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content is required and should be max 1000 characters"),
  check("blogId").trim().notEmpty().withMessage("Blog ID is required").isInt().withMessage("Blog ID must be a number"),
];

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorsMessages: errors.array({ onlyFirstError: true }).map((err: ValidationError) => ({
        message: err.msg,
        field: err.type === "field" ? err.path : "unknown",
      })),
    });
  }
  next();
};