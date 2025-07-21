const express = require("express");
const { registerUser, authUser, allUsers, setPublicKey, getPublicKey } = require("../controllers/userController")
const  upload  = require("../middleware/multer")
const router = express.Router();
const { protect } = require("../middleware/authMiddleware.js");


router.route("/register").post(
    upload.fields([
      { name: "pic", maxCount: 1 }
    ]),
    registerUser
  );
  
router.route("/login").post(authUser)
router.route("/").get(protect,allUsers)

// router.route("/key").post(protect,setPublicKey)
router.route("/key/:id").get(protect,getPublicKey)

module.exports = router;