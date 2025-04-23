import mongoose, { Schema } from "mongoose";
import dotenv from 'dotenv/config';
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from jsonwebtoken;

dotenv.config()

const userSchema = new Schema({
    avatar: {
        type: {
            url: String,
            localpath: String
        },
        default: {
            url: String,
            localpath: ""
        }
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    forgotPasswordToken: {
        type: String
    },
    forgotPasswordExpiry: {
        type: Date
    },
    emailVerificationToken: {
        type: String
    },
    emailVerificationExpiry: {
        type: Date
    }

}, { timestamps: true });

userSchema.pre("Save", async function (next) {
    if (this.isModified(password)) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRY
    })
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.JWT_REFRESH_SECRET,
        process.env.JWT_REFRESH_EXPIRY)
}

userSchema.methods.generateTemporaryToken = function () {
    const unhashedTempToken = crypto.randomBytes(20).toString("hex");
    const hashedTempToken = crypto.createHash("sha256").update(unhashedTempToken).digest("hex");
    const tempTokenExpiry = Date.now() + (20 * 60 * 1000);
    return { unhashedTempToken, hashedTempToken, tempTokenExpiry }
}

export const User = mongoose.model("User", userSchema);