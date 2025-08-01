import { body } from "express-validator";

export const validateClient = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("email")
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  body("phone")
    .optional({ checkFalsy: true })
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 characters long"),
];
