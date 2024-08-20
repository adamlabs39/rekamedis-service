import mongoose from 'mongoose';
import "dotenv/config";

const DB_HOST = process.env.MONGO_DB_HOST || 'localhost';
const DB_PORT = process.env.MONGO_DB_PORT || 27017;
const DB_NAME = process.env.MONGO_DB_NAME || 'adameds';

const mongooseInstance = async () => {
    try {
        await mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}?replicaSet=rs0`);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    }
};

export default mongooseInstance;
