import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';





const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


 
app.get('/', (req, res) => {
  res.json({ message: 'Quick Connect App is running!', version: '1.0.0' });
});


import routes from './routes/index.js'
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



export default app;