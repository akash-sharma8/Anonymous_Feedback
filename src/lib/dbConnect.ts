import mongoose from 'mongoose';

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection failed:", error);
    throw error;
  }
}

export default dbConnect;