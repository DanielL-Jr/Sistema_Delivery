import { Router } from 'express';
import { ComidasController } from '../controllers/ComidasController';

const comidasRoutes = Router();
const controller = new ComidasController();

comidasRoutes.post('/', controller.create);
comidasRoutes.get('/', controller.list);
comidasRoutes.get('/:id', controller.show);
comidasRoutes.put('/:id', controller.update);
comidasRoutes.delete('/:id', controller.delete);

export { comidasRoutes };