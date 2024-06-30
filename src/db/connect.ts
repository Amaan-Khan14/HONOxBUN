import mongoose from "mongoose";

export default async function connectDb() {
    await mongoose.connect(String(process.env.MONGODB_URI))
    console.log("mongo db connected successfully")
}