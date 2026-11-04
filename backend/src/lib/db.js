
import mongoose from "mongoose";

let connectionPromise = null;

export const connectToDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        console.log(
          `MongoDB connected: ${conn.connection.host}`
        );

        return conn.connection;
      })
      .catch((error) => {
        connectionPromise = null;

        console.error(
          "MongoDB connection failed:",
          error
        );

        throw error;
      });
  }

  return connectionPromise;
};
