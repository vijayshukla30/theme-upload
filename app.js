import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import api from './routes/index';
import connectDB from './config/dbConfig';
dotenv.config()
const { APP_PORT } = process.env
const app = express();
const port = APP_PORT || 3636;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(logger(':remote-addr - :remote-user :method :url [:date[clf]] :status :res[content-length] - :response-time ms'));
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

connectDB();
api({ app: app });

const server = app.listen(port, () => {
  console.log(`we are live on [${port}]`);
});

server.setTimeout(100000)