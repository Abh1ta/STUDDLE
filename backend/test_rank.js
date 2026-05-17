
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import userModel from './models/userModel.js';
import mongoose from 'mongoose';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

async function run() {
  await mongoose.connect(process.env.MONGODB_URL + '/studdle');
  const user = await userModel.findOne({ username: 'Adriana' });
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  try {
    const res = await fetch('http://localhost:5000/api/leaderboard/my-rank', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text.substring(0, 200));
  } catch (err) {
    console.error('Fetch error:', err.message);
  }
  process.exit(0);
}
run().catch(console.error);
