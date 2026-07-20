import express from 'express';

const app = express();
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.json());
const PORT = process.env.PORT || 3000;
const entries = [
  { title: 'First note', body: 'Notes from the first session.' },
  { title: 'Second note', body: 'Notes from the second session.' },
  { title: 'Third note', body: 'Notes from the third session.' },
];

app.get('/', (req, res) => {
  res.send('Hello, web!');
});

app.get('/hello', (req, res) => {
  res.send('Learning how the web actually works, one route at a time.');
});

app.get('/hello/:name', (req, res) => {
  res.send(`Hello, ${req.params.name}!`);
});

app.get('/repeat/:word', (req, res) => {
  const word = req.params.word;
  res.send(`${word} ${word} ${word}`);
});

app.get('/count', (req, res) => {
  const from = req.query.from || 1;
  const to = req.query.to || 10;
  res.send(`Counting from ${from} to ${to}.`);
});

app.get('/api/info', (req, res) => {
  res.json({ course: 'COMPSCI 326', topic: 'Web Programming' });
});

app.get('/api/error', (req, res) => {
  res.status(400).send('Bad request.');
});

app.get('/status', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});


app.get('/entries', (req, res) => {
  res.render('entries', { title: 'My Notes', entries });
});

app.post('/entries', (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    res.status(400).json({ error: 'title and body are required' });
    return;
  }
  const newEntry = { title, body };
  entries.push(newEntry);
  res.status(201).json(newEntry);
});

app.delete('/entries/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (id < 0 || id >= entries.length) {
    res.status(404).json({ error: 'Entry not found' });
    return;
  }
  entries.splice(id, 1);
  res.status(204).send();
});

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});