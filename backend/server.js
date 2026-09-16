const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(path.join(__dirname, 'playandlearn.db'));

const seedDatabase = () =>
  new Promise((resolve, reject) => {
    const createStatements = [
      'CREATE TABLE IF NOT EXISTS users (id INTEGER, name TEXT, email TEXT, age INTEGER);',
      'CREATE TABLE IF NOT EXISTS products (id INTEGER, name TEXT, price INTEGER, stock INTEGER);',
      'CREATE TABLE IF NOT EXISTS employees (id INTEGER, name TEXT, department TEXT, salary INTEGER);',
      'CREATE TABLE IF NOT EXISTS orders (id INTEGER, customer_id INTEGER, order_date TEXT, status TEXT);',
      'CREATE TABLE IF NOT EXISTS customers (id INTEGER, name TEXT, email TEXT, is_active INTEGER);',
    ];

    const inserts = [
      "INSERT OR IGNORE INTO users (id, name, email, age) VALUES (1, 'John Doe', 'john@example.com', 28), (2, 'Jane Smith', 'jane@example.com', 34), (3, 'Bob Johnson', 'bob@example.com', 45), (4, 'Alice Brown', 'alice@example.com', 29), (5, 'Charlie Davis', 'charlie@example.com', 52);",
      "INSERT OR IGNORE INTO products (id, name, price, stock) VALUES (1, 'Laptop', 999, 15), (2, 'Mouse', 25, 50), (3, 'Keyboard', 79, 30), (4, 'Monitor', 299, 20), (5, 'USB Cable', 10, 100);",
      "INSERT OR IGNORE INTO employees (id, name, department, salary) VALUES (1, 'John Smith', 'IT', 75000), (2, 'Sarah Johnson', 'HR', 65000), (3, 'Mike Davis', 'IT', 80000), (4, 'Emily Brown', 'Finance', 72000), (5, 'David Lee', 'IT', 77000);",
      "INSERT OR IGNORE INTO orders (id, customer_id, order_date, status) VALUES (101, 1, '2024-01-15', 'Completed'), (102, 2, '2024-02-20', 'Pending'), (103, 1, '2024-03-10', 'Completed'), (104, 3, '2024-03-25', 'Shipped'), (105, 2, '2024-04-05', 'Completed');",
      "INSERT OR IGNORE INTO customers (id, name, email, is_active) VALUES (1, 'Alice Wilson', 'alice.w@example.com', 1), (2, 'Bob Martinez', 'bob.m@example.com', 1), (3, 'Carol White', 'carol.w@example.com', 0), (4, 'David Green', 'david.g@example.com', 1), (5, 'Eve Thompson', 'eve.t@example.com', 1);",
    ];

    db.serialize(() => {
      createStatements.forEach((statement) => db.run(statement));
      inserts.forEach((statement) => db.run(statement));
      db.run('SELECT 1', (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });
  });

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/query', (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query is required.' });
  }

  db.all(query, (error, rows) => {
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.json({ rows });
  });
});

app.post('/api/progress', (req, res) => {
  const { username, exerciseId, completed } = req.body;
  if (!username || !exerciseId) {
    return res.status(400).json({ error: 'username and exerciseId are required' });
  }

  res.json({
    success: true,
    username,
    exerciseId,
    completed: Boolean(completed),
    message: 'Progress saved',
  });
});

seedDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database init failed:', error);
    process.exit(1);
  });