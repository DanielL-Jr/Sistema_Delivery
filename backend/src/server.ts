import 'express-async-errors';
import express from 'express';
import { routes } from './Routes';
import { errorInterceptor } from './errors/errorInterceptor';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.use(errorInterceptor)

app.listen(3333, ()=>{
    console.log('Server started on port 3333');
});