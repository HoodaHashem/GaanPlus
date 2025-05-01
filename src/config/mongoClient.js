import mongoose from "mongoose";
import 'dotenv/config'

const mongoClient = await mongoose.connect(process.env.DATABASE_URL)

export default mongoClient
