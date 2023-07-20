import config from "../config/index.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

export const dbConnect = async () => {
    try {
        const URL = config.db.mongodb;
        await mongoose.connect(URL);
        logger.info("Database connected.")
    } catch (error) {
        logger.error('Error to connect to database', error.message)
    }
} 