import { Router } from 'express';
import { PedidosController } from '../controllers/PedidosController';

const pedidosRoutes = Router();
const controller = new PedidosController();

pedidosRoutes.post('/', controller.create);
pedidosRoutes.get('/', controller.list);
pedidosRoutes.get('/:id', controller.show);

export { pedidosRoutes };