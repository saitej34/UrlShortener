
import mongoose, { Connection } from 'mongoose';

const  MONGODB_URI  = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

export default async function connectToDatabase() {

  const connection = await mongoose.connect("mongodb+srv://urlshort:zuQV2pmpjAAFQgkz@cluster0.ligpuzz.mongodb.net/?retryWrites=true&w=majority");

  return connection;
}
