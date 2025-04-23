import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        console.log("From env file", process.env.MONGO_ATLAS_CONNECT_URI)
        await mongoose.connect(process.env.MONGO_ATLAS_CONNECT_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("Mongodb connection failed", error);
        process.exit(1)
    }
}

export default connectDB;