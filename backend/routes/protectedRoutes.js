const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

router.get("/dashboard", verifyToken, (req, res) => {
    res.status(200).json({
        message: "Dashboard accessed successfully",
        user: req.user,
    });
});

module.exports = router;