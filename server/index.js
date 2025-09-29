require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());


//dummy db

const users = [];


const SECRET_KEY = process.env.SECRET_KEY;


// register

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, password: hashedPassword };
  users.push(newUser);
  console.log(users)
  res.status(201).json({ message: 'User registered successfully' });
});


// login

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});


// token verify krne k liye

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  console.log(token)

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
};


// protected

app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to the protected route!', user: req.user });
});


// server start 

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
