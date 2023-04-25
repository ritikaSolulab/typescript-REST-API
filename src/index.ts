import express from 'express';
import http from 'http';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router'
import log from './utils/logger';

const app = express();

app.use(cors({
	credentials:true,
}));

app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use('/', router());

const MONGO_URI = 'mongodb+srv://admin:admin123@cluster0.mxfmsmq.mongodb.net/test'

const connect = async() => {
    try{
        await mongoose.connect(MONGO_URI);
        log.info("Connected to mongoDB")
    }catch(error){
        throw error;
    }
}

const server = http.createServer(app);

server.listen(8080, () => {
	connect();
	log.info('Server running on http://localhost:8080');
})