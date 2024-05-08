const express = require('express');
const path = require('path');
const mysql = require('mysql2'); // Import the mysql2 package
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sujal123@',
  database: 'dbmsproject'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
    return;
  }
  console.log('Connected to database as id', connection.threadId);
});

app.get('/', async (req, res) => {
  connection.query('SELECT * FROM stock_data', (error, results, fields) => {
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    const stockData = results;
    console.log(stockData);
    res.send( stockData);
  });
});

app.post('/buy',async(req,res)=> {
  const {id,quantity} = req.body;
  console.log('id ',id);
  console.log('quantity ',quantity);
  connection.query(`UPDATE portfolio_data SET Quantity = Quantity + ${Number(quantity)} WHERE ID = ${Number(id)}`,(error,results,fields) => {
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json({ status: 'success', message: 'Data received successfully' });
  });
});

app.post('/sell',async(req,res)=> {
  const {id,quantity} = req.body;
  console.log('id ',id);
  console.log('quantity ',quantity);
  connection.query(`UPDATE portfolio_data SET Quantity = Quantity - ${Number(quantity)} WHERE ID = ${Number(id)}`,(error,results,fields) => {
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json({ status: 'success', message: 'Data received successfully' });
  });
})

app.get('/portfolio', async (req, res) => {
  connection.query('SELECT * FROM portfolio_data', (error, results, fields) => {
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    const stockData = results;
    console.log(stockData);
    res.send( stockData);
  });
});

app.get('/individualStock/:id',async(req,res) => {
  const id = req.params.id;
  connection.query(`SELECT * FROM stock_data where ID=${id}`,(error,results,fields) => {
    if (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    const stockData = results;
    console.log(stockData);
    res.send( stockData);
  });
})



app.listen(8080, () => {
  console.log('Server successfully running on port 8080');
});
