import express from 'express';
import morgan from 'morgan';
import entriesRouter from './routes/entries.js';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import { attachUser } from './middleware/attachUser.js';

await mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/devdb'
);

const app = express();
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production';
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(morgan('dev'));
app.use(cookieParser(SESSION_SECRET));
app.use(attachUser);
app.use(authRouter);

app.get('/', (req, res) => {
  res.status(200).send('Hello, web!');
});

app.get('/hello', (req, res) => {
  res.status(200).send('Learning how the web actually works, one route at a time.');
});

app.get('/hello/:name', (req, res) => {
  res.status(200).send(`Hello, ${req.params.name}!`);
});

app.get('/repeat/:word', (req, res) => {
  const word = req.params.word;
  res.status(200).send(`${word} ${word} ${word}`);
});

app.get('/count', (req, res) => {
  const from = req.query.from || 1;
  const to = req.query.to || 10;
  res.status(200).send(`Counting from ${from} to ${to}.`);
});

app.get('/api/info', (req, res) => {
  res.status(200).json({ course: 'COMPSCI 326', topic: 'Web Programming' });
});

app.get('/api/error', (req, res) => {
  res.status(400).send('Bad request.');
});

app.get('/status', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.get("/about", (req, res) => {
  res.status(200).render("about", { title: "About" });
});

app.use('/entries', entriesRouter);

app.get('/slow', async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  res.status(200).send('Done waiting.');
});

app.get('/three-posts', async (req, res) => {
  const ids = [1, 2, 3];
  const titles = [];
  for (const id of ids) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    const post = await response.json();
    titles.push(post.title);
  }
  res.status(200).json({ titles });
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});// work in progress
// step one
// step two
// step three
// checkpoint 1
// checkpoint 2
// checkpoint 3
// BUG: off-by-one introduced here
// checkpoint 4
// checkpoint 5
// stable checkpoint
// hotfix: correct the startup log message
// wip: new feature, not ready yet
