import { Router } from 'express';
import * as todoController from '../controllers/todoController.ts';

const todoRouter = Router();

todoRouter.get('/', todoController.getTasks);
todoRouter.post('/', todoController.createTask);
todoRouter.put('/:id', todoController.editTask);
todoRouter.delete('/:id', todoController.deleteTask);

export default todoRouter;