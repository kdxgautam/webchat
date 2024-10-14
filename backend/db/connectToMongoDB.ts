import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGO_DB_URI;
    if (!mongoUri) {
      throw new Error("MONGO_DB_URI is not defined in the environment variables");
    }

    // Ensure MongoDB connection options are specified for better stability
    await mongoose.connect(mongoUri);

    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.error("Error connecting to MongoDB", error.message);
    process.exit(1);  // Exit the process if MongoDB connection fails
  }
};

export default connectToMongoDB;
