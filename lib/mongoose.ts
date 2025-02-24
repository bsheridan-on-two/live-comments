import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedConnection : Connection | null  = null;

async function dbConnect() {
  if (cachedConnection) {
    return cachedConnection;
  }
    const cnx = await mongoose.connect(process.env.MONGODB_URI!);
    cachedConnection = cnx.connection;
    return cachedConnection;
 }

export default dbConnect;
