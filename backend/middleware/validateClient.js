import { body } from 'express-validator';
 
export const validateClient = [
    body("name")
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    body("email")
        .isEmail()
        .withMessage("Valid email is required"),
    body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .isLength({ min: 10, max: 15 })
        .withMessage("Phone number must be between 10 and 15 characters long")
        .optional(),
];

