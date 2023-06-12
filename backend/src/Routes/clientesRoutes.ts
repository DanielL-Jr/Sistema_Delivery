import { Router } from 'express';
import { ClientesController } from '../controllers/ClientesController';

const clientesRoutes = Router();
const controller = new ClientesController();

clientesRoutes.post('/', controller.create);
clientesRoutes.get('/', controller.list);
clientesRoutes.get('/:id', controller.show);
clientesRoutes.put('/:id', controller.update);
clientesRoutes.delete('/:id', controller.delete);

export { clientesRoutes };