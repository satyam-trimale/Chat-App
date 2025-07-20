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
    const { name, email, password, publicKey, encryptedPrivateKey, privateKeySalt, privateKeyIv } = req.body;

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
        // Save the key data
        publicKey,
        encryptedPrivateKey,
        privateKeySalt,
        privateKeyIv    
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
            token: generateToken(user._id),
            // IMPORTANT: Send the encrypted key data back to the client on login
            publicKey: user.publicKey,
            encryptedPrivateKey: user.encryptedPrivateKey,
            privateKeySalt: user.privateKeySalt,
            privateKeyIv: user.privateKeyIv            
        })
    }else{
        res.status(401)
        throw new Error("invalid email or password")
    }
})

// const setPublicKey = asyncHandler(async (req,res) => {
//     const { publicKey } = req.body;
//     const userId = req.user._id;

//     if(!publicKey){
//         res.status(400);
//         throw new Error("Public key is required");
//     }

//     const updatedUser = await User.findByIdAndUpdate(
//         userId,
//         {publicKey: publicKey},
//         {new : true}
//     );

//     if(!updatedUser){
//         res.status(404);
//         throw new Error("User not found");
//     }

//     res.status(200).json({message: "Public key updated successfully"});
// })

const getPublicKey = asyncHandler(async (req,res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select("publicKey");

    if(!user || !user.publicKey){
        res.status(404);
        throw new Error("User or public key not found");
    }
    res.status(200).json({publicKey: user.publicKey})
})

module.exports = {registerUser, authUser, allUsers, getPublicKey}