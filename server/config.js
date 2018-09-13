import dotenv from "dotenv";

dotenv.config();

const config = {
    apiPort: process.env.API_PORT,
    mongodbUri: process.env.MONGODB_URI
}

export default config;