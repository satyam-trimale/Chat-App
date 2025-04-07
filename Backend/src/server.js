const express = require("express");
const app = express();
const { chats } = require("./data");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db/index");
const userRoutes = require("./routes/userRoutes")
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json())
app.get("/", (req, res) => {
  res.send("Api is running");
});
app.get("/api/chats", (req, res) => {
  res.send(chats);
});
app.get("/api/chat/:id", (req, res) => {
  //   console.log(req.params.id);
  const singleChat = chats.find((c) => c._id === req.params.id);
  res.send(singleChat);
});
app.use("/api/user",userRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT} `));
