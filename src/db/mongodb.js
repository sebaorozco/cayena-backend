import config from "../config/index.js";
import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const URL = config.db.mongodb;
        await mongoose.connect(URL);
        console.log("Database connected.")
    } catch (error) {
        console.error('Error to connect to database', error.message)
    }
} 