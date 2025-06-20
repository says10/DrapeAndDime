import mongoose from "mongoose";

let storeConnection: mongoose.Connection | null = null;

export const getStoreConnection = async () => {
  if (storeConnection && storeConnection.readyState === 1) return storeConnection;
  storeConnection = await mongoose.createConnection(
    process.env.MONGODB_URL || "",
    { dbName: "Borcelle_Store" }
  );
  return storeConnection;
}; 