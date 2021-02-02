const express = require("express");
const authControllers = require("../controllers/authcontrollers");

const router = express.Router();

router.get("/signup", authControllers.isLoggedIn);
router.get("/login", authControllers.isLoggedIn);

module.exports = router;
