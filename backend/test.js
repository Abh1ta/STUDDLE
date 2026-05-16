
import 'dotenv/config';
import mongoose from 'mongoose';
import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import userModel from './models/userModel.js';
import friendshipModel from './models/friendshipModel.js';

async function run() {
  await mongoose.connect(process.env.MONGODB_URL + '/studdle');
  console.log('Connected');
  
  const topUsers = await userModel.find().select('username avatar_url xp level').sort({ xp: -1 }).limit(5);
  console.log('Top users:', topUsers.length);
  
  const anyUser = await userModel.findOne();
  if (anyUser) {
    const userId = anyUser._id.toString();
    const friendships = await friendshipModel.find({
        status: 'accepted',
        $or: [{ user_a_id: userId }, { user_b_id: userId }]
    });
    console.log('Friendships for', anyUser.username, ':', friendships.length);
  }
  process.exit(0);
}
run().catch(console.error);
