import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import api from './routes/index';
import connectDB from './config/dbConfig';
import dotenv from 'dotenv'
dotenv.config()
// import { uploadTheme } from './controller'
const app = express();
const port = 3636;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(
  logger(
    ':remote-addr - :remote-user :method :url [:date[clf]] :status :res[content-length] - :response-time ms',
  )
);

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// uploadTheme()
// controller.app()

connectDB();
api({ app: app });

const server = app.listen(port, () => {
  console.log(`we are live on [${port}]`);
});

server.setTimeout(100000)