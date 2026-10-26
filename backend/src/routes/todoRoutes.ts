import { Router } from 'express';
import * as todoController from '../controllers/todoController.ts';

const todoRouter = Router();

todoRouter.get('/', todoController.getTasks);
todoRouter.post('/', todoController.createTask);
todoRouter.put('/:id', todoController.updateTask);
todoRouter.delete('/:id', todoController.removeTask);

export default todoRouter;