import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log('*** MongoDB connected successfully');
    });

    const mongoUrl = process.env.MONGODB_URL;

    if (!mongoUrl) {
      throw new Error('MONGODB_URL lipsește din .env');
    }

    await mongoose.connect(`${mongoUrl}/studdle`, {
      serverSelectionTimeoutMS: 30000,
    });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;