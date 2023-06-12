import { Router } from 'express';
import { helloworldRoutes } from './helloworldRoutes';
import { clientesRoutes } from './clientesRoutes';
import { comidasRoutes } from './comidasRoutes';

const routes = Router();

routes.use('/hello-world', helloworldRoutes);
routes.use('/users', clientesRoutes);
routes.use('/comidas', comidasRoutes);

export {routes};