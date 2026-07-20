import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, web!');
});

app.get('/about', (req, res) => {
  res.send('This is a web programming course.');
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

app.use((req, res) => {
  res.status(404).send('Page not found.');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});