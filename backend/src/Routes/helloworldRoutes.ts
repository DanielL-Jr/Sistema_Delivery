import { Router } from 'express';
import { HelloWorldController } from '../controllers/HelloWorldController';

const helloworldRoutes = Router();
const controller = new HelloWorldController();

helloworldRoutes.get('/', controller.show);

export { helloworldRoutes };