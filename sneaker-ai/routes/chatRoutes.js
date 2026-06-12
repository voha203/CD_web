const express = require("express");
const { handleChat } = require("../controllers/chatController");

const router = express.Router();

// Endpoint sẽ là: POST /api/chat/ask
router.post("/", handleChat);

module.exports = router;