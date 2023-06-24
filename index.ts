import * as express from 'express';
import { Express, Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import router from './api';
dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

// DB 연결
mongoose.connect(MONGO_URI!)
.catch(err => console.log(err))
.then(() => console.log('Database Connected!'));

app.set("views", "view"); // view files dir
app.set("view engine", "ejs"); // view engine setting

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

app.use(morgan('dev'));

// 정적 파일 위치 설정
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 라우팅 모듈 연결
app.use('/', router);

// 에러 처리
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(404).send('잘못된 요청입니다.');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('알수 없는 오류가 발생했습니다.');
});
