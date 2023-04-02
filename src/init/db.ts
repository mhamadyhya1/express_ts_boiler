import mongoose from 'mongoose';

export default async () => {
  const mongoString = 'mongodb://localhost:27017/authPractice';
  let connected = false;
  try {
    console.log('fattt to mongo connect...');
    if (!connected) {
      console.log('Connecting to mongo...');
      await mongoose.connect(`${mongoString}`);
      connected = true;
      console.log('DB Connected...');
    }
  } catch (e: any) {
    connected = false;
    throw new Error('Error connceting to mongodb >> ' + e.stack.toString());
  }
};
