const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path'); // Use path module for better file path handling
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serving static files like CSS and JS

// Create or open the database
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Error opening database ' + err.message);
  }
});

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE, // Ensure usernames are unique
  password TEXT,
  profile_completed INTEGER DEFAULT 0
)`);

// Serve the registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'Register.html')); // Use path.join for cross-platform compatibility
});

// Registration logic
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err) => {
    if (err) {
      return res.status(500).send('Error registering user. Username may already exist.');
    }
    res.redirect('/login');
  });
});

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Login logic
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err || !user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send('Invalid credentials');
    }

    // Check if the profile is completed
    if (user.profile_completed === 1) {
      res.redirect('/dashboard');
    } else {
      res.redirect('/complete-profile');
    }
  });
});

// Serve the complete profile form
app.get('/complete-profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'form.html'));
});

// Handle profile form submission
app.post('/complete-profile', (req, res) => {
  const { username } = req.body; // Removed additionalInfo since it wasn't used
  db.run(`UPDATE users SET profile_completed = 1 WHERE username = ?`, [username], (err) => {
    if (err) {
      return res.status(500).send('Error completing profile.');
    }
    res.redirect('/dashboard');
  });
});

// Serve the dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'Timeline.html'));
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
