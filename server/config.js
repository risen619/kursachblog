import dotenv from "dotenv";

dotenv.config();

const config = {
    apiPort: process.env.API_PORT,
    mongodbUri: process.env.MONGODB_URI,
    jwtSecret: "9b7c37bbaa6a417ba0b7ed291569d8ceF"
}

export default config;