import 'express-async-errors';
import express from 'express';
import { routes } from './Routes';
import { errorInterceptor } from './errors/errorInterceptor';

const app = express();

app.use(express.json());
app.use(routes);

app.use(errorInterceptor)

app.listen(3333, ()=>{
    console.log('Server started on port 3333');
});