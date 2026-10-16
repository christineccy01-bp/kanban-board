import express, { type Express, type Request, type Response } from 'express';
import { neon } from '@neondatabase/serverless';

const app: Express = express();
const PORT = process.env.PORT || 4242;

const sql = neon(process.env.DATABASE_URL!);

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

app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`);
});