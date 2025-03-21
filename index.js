import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { app , server } from './src/lib/socket.js';
import cookieParser from 'cookie-parser';
import authRoute from './src/routes/auth.route.js';
import msgRoute from './src/routes/message.route.js';
import { connectDB } from './src/lib/db.js';
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/msg', msgRoute);

server.listen(PORT, async () => {
    console.log(`http://localhost:${PORT}`);
    await connectDB();
});