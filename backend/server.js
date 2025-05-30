import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js'

dotenv.config({ path: './config.env' });


const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
  connectDB() ;
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});