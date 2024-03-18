import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        // to enable optimized search use index: true
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        // to enable optimized search use index: true
        index: true
    },
    avatar: {
        type: String, //cloudinary url
        required: true,
    },
    coverImage:{
        type: String //cloudinary url
    },
    watchHistory: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    password: {
        type: String,
        required: [true,"Password is required"],
    },
    refreshToken: {
        type: String
    }

},{timestamps:true})

// we are not using arrow function here becuase it does not have "this" or it has no context
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}

export const User = mongoose.model("User",userSchema);