const express = require("express")
const {getUsersForSidebar, getMessages, sendMessage} = require("../controllers/messageController")
const {protect} = require("../middleware/authMiddleware")

const router = express.Router();

router.route("/users").get(protect, getUsersForSidebar)
router.route("/:id").get(protect, getMessages)

router.post("/send/:id",protect, sendMessage)




module.exports = router