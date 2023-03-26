import mongoose from "mongoose";

export const init = async () => {
    try {
        const URI = "mongodb+srv://sebaorozco:nilito21@clustercayena.r7yll3r.mongodb.net/test";
        await mongoose.connect(URI);
        console.log("Database connected.")
    } catch (error) {
        console.error('Error to connect to database', error.message)
    }
} 

