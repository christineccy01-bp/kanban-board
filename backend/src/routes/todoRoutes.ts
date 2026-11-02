import { Router } from 'express';
import * as todoController from '../controllers/todoController.ts';

const todoRouter = Router();

/**
 * @openapi
 * /todo_item:
 *   get:
 *     summary: List all todo items
 *     responses:
 *       200:
 *         description: A list of todo items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   todo_item_id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   status:
 *                     type: string
 *                     enum: [N, P, D, A]
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Failed to fetch todo items
 */
todoRouter.get('/', todoController.getTasks);

/**
 * @openapi
 * /todo_item:
 *   post:
 *     summary: Create a new todo item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [N, P, D, A]
 *                 description: N = New, P = In Progress, D = Done, A = Archived
 *           example:
 *             title: "Buy groceries"
 *             description: "Milk, Bread, Eggs"
 *             status: "N"
 *     responses:
 *       201:
 *         description: Todo item created successfully
 *       400:
 *         description: Validation error (missing or invalid fields)
 */
todoRouter.post('/', todoController.createTask);


/**
 * @openapi
 * /todo_item/{id}:
 *   put:
 *     summary: Update a todo item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [N, P, D, A]
 *           example:
 *             title: "Buy groceries"
 *             description: "Milk, Bread, Eggs, Butter"
 *             status: "P"
 *     responses:
 *       200:
 *         description: Todo item updated
 *       400:
 *         description: Validation error (missing or invalid fields)
 *       404:
 *         description: Todo item not found
 */
todoRouter.put('/:id', todoController.editTask);

/**
 * @openapi
 * /todo_item/{id}:
 *   delete:
 *     summary: Delete a todo item by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Todo item deleted (no response body)
 *       404:
 *         description: Todo item not found
 */
todoRouter.delete('/:id', todoController.deleteTask);

export default todoRouter;