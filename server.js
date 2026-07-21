import express from 'express';
import { readFile, writeFile } from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = 'entries.json';

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/entries', async (req, res) => {
  const data = await readFile(DATA_FILE, 'utf-8');
  const entries = JSON.parse(data);
  res.set('Cache-Control', 'public, max-age=60');
  res.set('X-Total-Count', entries.length);
  res.status(200).render('entries', { title: 'My Notes', entries });
});

app.post('/entries', async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(400).json({ error: 'title and body are required' });
    return;
  }
  const data = await readFile(DATA_FILE, 'utf-8');
  const entries = JSON.parse(data);
  const newEntry = { title, body };
  entries.push(newEntry);
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
  res.status(201).json(newEntry);
});

app.post('/entries/classic', async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(400).send('title and body are required');
    return;
  }
  const data = await readFile(DATA_FILE, 'utf-8');
  const entries = JSON.parse(data);
  entries.push({ title, body });
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
  res.redirect('/entries');
});

app.delete('/entries/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const data = await readFile(DATA_FILE, 'utf-8');
  const entries = JSON.parse(data);
  if (id < 0 || id >= entries.length) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }
  entries.splice(id, 1);
  await writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
  res.status(204).send();
});

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
});