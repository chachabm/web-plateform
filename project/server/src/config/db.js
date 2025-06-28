<<<<<<< HEAD
import mongoose from 'mongoose';
// Import dotenv to load environment variables
import dotenv from 'dotenv';
dotenv.config();
=======
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

>>>>>>> cdd0493785f08061093ee2fb145cb97b73d6e959
const connectDB = async () => {
  try {
    console.log(`🔗 Connexion à MongoDB: ${process.env.MONGODB_URL}`);

    const conn = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });


    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
