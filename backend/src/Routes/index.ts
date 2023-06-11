import { Router } from 'express';
import { helloworldRoutes } from './helloworldRoutes';

const routes = Router();

routes.use('/hello-world', helloworldRoutes);

export {routes};