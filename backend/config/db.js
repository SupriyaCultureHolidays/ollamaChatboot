import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/testdb";
        await mongoose.connect(mongoURI);
        console.log("✅ Connected to MongoDB:", mongoURI);
    } catch (error) {
        console.error("❌ MongoDB Connection Error:", error);
        process.exit(1);
    }
};

export default connectDB;
