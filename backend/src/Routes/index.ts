import { Router } from 'express';
import { helloworldRoutes } from './helloworldRoutes';
import { clientesRoutes } from './clientesRoutes';

const routes = Router();

routes.use('/hello-world', helloworldRoutes);
routes.use('/users', clientesRoutes);

export {routes};