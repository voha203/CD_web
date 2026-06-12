require("dotenv").config();
const express = require("express");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Gắn route
app.use("/api/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🤖 Sneaker AI đang chạy tại port ${PORT}...`);
});