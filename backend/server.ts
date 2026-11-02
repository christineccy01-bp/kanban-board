import express, { type Express, type Request, type Response } from 'express';
import { sql } from './db/client.ts';
import cors from 'cors';
import todoRouter from './src/routes/todoRoutes.ts';
import swaggerDocs from './src/documentation/openApi.ts';

const app: Express = express();
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(express.json());
app.use('/todo_item', todoRouter);

const PORT = process.env.PORT || 4242;

//default to see version of DB (from neon documentation)
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

swaggerDocs(app, Number(PORT));

//making sure backend is running
const server = app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => process.exit(0)); // stop taking new requests, finish current ones, then exit
});

