import mongoose from 'mongoose';
import "dotenv/config";

const DB_HOST = process.env.MONGO_DB_HOST || 'localhost';
const DB_PORT = process.env.MONGO_DB_PORT || 27017;
const DB_NAME = process.env.MONGO_DB_NAME || 'adameds';
const DB_USER = process.env.MONGO_DB_USERNAME || 'admin';
const DB_PASSWORD = process.env.MONGO_DB_PASSWORD || 'admin';
const DB_AUTH_SOURCE = process.env.MONGO_DB_AUTH_SOURCE || 'admin';

const mongooseInstance = async () => {
    try {
        const url = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
        console.log(url);
        await mongoose.connect(url);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
};

export default mongooseInstance;
