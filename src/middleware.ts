import { Request, Response, NextFunction } from "express";
import {
  check,
  validationResult,
  ValidationError as ExpressValidatorError,
} from "express-validator";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === "GET") return next();
  if (req.method === "DELETE" && req.path === "/ht_02/api/testing/all-data") return next();

  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Basic ")) return res.sendStatus(401);

  const base64 = authHeader.split(" ")[1];
  const decoded = Buffer.from(base64, "base64").toString();
  const [login, password] = decoded.split(":");

  if (login !== "admin" || password !== "qwerty") return res.sendStatus(401);

  next();
};

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errorsMessages: errors.array({ onlyFirstError: true }).map((err) => ({
        message: err.msg,
        field: (err as any).param
      }))
    });
  }
  next();
};

export const blogValidationRules = [
  check("name")
    .trim()
    .isLength({ min: 1, max: 15 })
    .withMessage("Name should be between 1 and 15 characters"),
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

export const postValidationRules = [
  check("title")
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Title is required and should be max 30 characters"),
  check("shortDescription")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Short description is required and should be max 100 characters"),
  check("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Content is required and should be max 1000 characters"),
  check("blogId")
    .trim()
    .notEmpty()
    .withMessage("Blog ID is required")
    .isInt()
    .withMessage("Blog ID must be a number"),
];
