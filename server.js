const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the "public" directory

// Initialize Database and Create Users Table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT,
        profileCompleted INTEGER DEFAULT 0
    )`);
});

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve Register.html
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Register.html'));
});

// Route to serve CompleteProfile.html
app.get('/complete-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Registration route
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    // Check if username or email already exists
    const checkQuery = `SELECT * FROM users WHERE username = ? OR email = ?`;
    db.get(checkQuery, [username, email], (err, existingUser) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already in use' });
        }

        // Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ message: 'Error hashing password' });
            }

            const query = `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`;
            db.run(query, [username, hashedPassword, email], function (err) {
                if (err) {
                    return res.status(500).json({ message: 'Error registering user' });
                }
                // Redirect to profile completion after registration
                res.status(201).json({ message: 'User registered successfully!', redirect: '/complete-profile' });
            });
        });
    });
});

// Profile completion route
app.post('/complete-profile', (req, res) => {
    const userId = req.body.userId; // Assume you pass userId from the front end

    // Update the user to mark their profile as completed
    const query = `UPDATE users SET profileCompleted = 1 WHERE id = ?`;
    db.run(query, [userId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error completing profile' });
        }
        res.json({ message: 'Profile completed successfully!' });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Fetch the user from the database
    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }

        if (!user) {
            // User not found
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Compare the hashed password with the provided password
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }

            if (result) {
                // Password match, check if profile is completed
                if (!user.profileCompleted) {
                    return res.json({ success: true, message: 'Login successful', redirect: '/complete-profile', userId: user.id });
                } else {
                    res.json({ success: true, message: 'Login successful' });
                }
            } else {
                // Password doesn't match
                res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
