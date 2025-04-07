const asyncHandler = require("../utils/asyncHandler.js")
const User = require("../Models/userModel.js")
const generateToken = require("../config/generateToken.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

const allUsers = asyncHandler(async (req,res) => {
    const keyword = req.query.search
    ?{
        $or: [
            {name:{$regex: req.query.search, $options: "i"}},
            {email:{$regex: req.query.search, $options: "i"}},
        ],
    }
    :{};

    const users = await User.find(keyword).find({_id:{$ne : req.user._id}})
    res.send(users)
})
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please enter all fiealds")
    }

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error("User already exists")
    }
    const picLocalPath = req.files?.pic[0]?.path;
    
    const pic = await uploadOnCloudinary(picLocalPath)


    const user = await User.create({
        name,
        email,
        password,
        pic : pic?.url || "",
    })

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id),
        })
    }else{
        res.status(400)
        throw new Error("User not found")
    }
})

const authUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if(user && (await user.matchPassword(password))){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.emai,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }else{
        res.status(401)
        throw new Error("invalid email or password")
    }
})

module.exports = {registerUser, authUser, allUsers}