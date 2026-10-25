import express, { type Express, type Request, type Response } from 'express';
import { neon } from '@neondatabase/serverless';
import cors from 'cors';

const app: Express = express();
const PORT = process.env.PORT || 4242;

app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json());

const sql = neon(process.env.DATABASE_URL!);

//default to see version of DB
app.get('/', async (req: Request, res: Response) => {
  try{
    const [result] = await sql`SELECT version()`;
    const version = result?.version || `No version found`;
    res.json({ version });
  } catch (error){
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Failed to connect to database.' })
  }
});

//get items to display
app.get('/todo_item', async (req: Request, res: Response) => {
  try{
    const todoItem = await sql`SELECT * FROM todo_items`;
    res.json(todoItem);
    res.status(200).json(todoItem);
  } catch (error){
    console.error('Database query failed:', error);
    res.status(500).json({ error: 'Failed to connect to database.' })
  }
});

//creating new task
app.post('/todo_item', async (req: Request, res: Response) => {
  const { title, description, status } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required.' });
  }
  try {
    const [created] = await sql`
    INSERT INTO todo_items (title, description, status)
      VALUES (${title}, ${description}, ${status})
      RETURNING *`;
    res.status(201).json(created);
  } catch (error) {
    console.error('Insert failed:', error);
    res.status(500).json({ error: 'Failed to create todo item.' });
  }
});

//drag and drop and edit tasks endpoint
app.put('/todo_item/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status } = req.body;

  if (typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required.' });
  }
  if (typeof description !== 'string') {
    return res.status(400).json({ error: 'Title is required.' });
  }
  if (!['N', 'P', 'D', 'A'].includes(status)) {
    return res.status(400).json({ error: 'Title is required.' });
  }

  try {
    const [updated] = await sql`
      UPDATE todo_items SET 
        title = ${title}, 
        description = ${description}, 
        status = ${status}
      WHERE todo_item_id = ${id}
      RETURNING *`;
    if (!updated) {
      return res.status(404).json({ error: 'Todo item not found.' });
    }
    res.json(updated);
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ error: 'Failed to update todo item.' });
  }
});

//delete task endpoint
app.delete('/todo_item/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const [deleted] = await sql`
      DELETE FROM todo_items
      WHERE todo_item_id = ${id}
      RETURNING *`;
    if (!deleted) {
      return res.status(404).json({ error: 'Todo item not found.' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('Delete failed:', error);
    res.status(500).json({ error: 'Failed to delete todo item.' });
  }
});

//making sure backend is running
app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`);
});

