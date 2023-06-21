import { Router } from 'express';
import { clientesRoutes } from './clientesRoutes';
import { comidasRoutes } from './comidasRoutes';
import { pedidosRoutes } from './pedidosRoutes';

const routes = Router();

routes.use('/users', clientesRoutes);
routes.use('/comidas', comidasRoutes);
routes.use('/pedidos', pedidosRoutes);

export {routes};