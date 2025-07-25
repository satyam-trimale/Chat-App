const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    publicKey: {
      type: String,
      default: "",
      // required: true,
    },
    encryptedPrivateKey: { type: "String" },
    privateKeySalt: { type: "String" }, // Salt for password-based key derivation
    privateKeyIv: { type: "String" },   // IV for AES encryption    
  },
  { timestamps: true }
);

userSchema.pre("save",async function (next){
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password,10)
  next()
})
userSchema.methods.matchPassword = async function (enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}
const User = mongoose.model("User", userSchema);
module.exports = User;
