const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const port = 3000;

const users = [
  { email: 'user@example.com', password: '$2a$10$WZ.7gX.gGImzGZ7gwbsj3.mw7wY/dtD3nHf4i9g.3Jp2zK9E7OWS6' } // password is "password"
];

app.use(bodyParser.json());
app.use(express.static('public'));

let jobData = [];

fs.createReadStream(path.join(__dirname, 'data job posts.csv'))
  .pipe(csv())
  .on('data', (row) => {
    jobData.push({
      title: row['Title'] || 'No title',
      company: row['Company'] || 'No company',
      location: row['Location'] || 'No location'
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid email or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid email or password' });

  const token = jwt.sign({ email: user.email }, 'secret-key', { expiresIn: '1h' });
  res.status(200).json({ message: 'Login successful', token });
});

app.get('/api/search', (req, res) => {
  const title = req.query.title?.toLowerCase() || '';
  const location = req.query.location?.toLowerCase() || '';

  const filtered = jobData.filter(job =>
    job.title.toLowerCase().includes(title) &&
    job.location.toLowerCase().includes(location)
  );

  res.json(filtered.slice(0, 10));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
