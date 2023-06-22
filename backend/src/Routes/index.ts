import { Router } from 'express';
import { clientesRoutes } from './clientesRoutes';
import { comidasRoutes } from './comidasRoutes';
import { pedidosRoutes } from './pedidosRoutes';
import { authenticateRoutes } from './authenticateRoutes';

const routes = Router();

routes.use('/users', clientesRoutes);
routes.use('/comidas', comidasRoutes);
routes.use('/pedidos', pedidosRoutes);
routes.use('/verify', authenticateRoutes);

export {routes};