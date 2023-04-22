const express = require('express');
const app = express();
const path = require('path');
const { Pool } = require('pg');

// Connect to ElephantSQL database
const connectionString = 'postgres://bfhnryrl:RJPG8wjo6uwrd6zT-ieAyPzrkM-VLGUq@mahmud.db.elephantsql.com/bfhnryrl';

const pool = new Pool({
  connectionString
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.send('server.js test');
  // return res.status(200).sendFile(path.join(__dirname, '../index.html'));
});

// Return all users to test connection
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

// Add a new user
app.post('/users', (req, res) => {
  const { name } = req.body;
  pool.query('INSERT INTO users (name) VALUES ($1)', [name], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(201).send(`User added.`);
  });
});

// Add new project
// Req body should include user_id and name
app.post('/projects', (req, res) => {
  const { user_id, name } = req.body;
  pool.query('INSERT INTO projects (user_id, name) VALUES ($1, $2)', [user_id, name], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(201).send(`Project added.`);
  });
});

// Get all projects for a user
app.get('/projects', (req, res) => {
  const { user_id } = req.body;
  pool.query('SELECT * FROM projects WHERE user_id = $1', [user_id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

// Get all projects across users
app.get('/projects/all', (req, res) => {
  pool.query('SELECT * FROM projects', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

// Add new task
// Req body should include project_id and task name
app.post('/tasks', (req, res) => {
  const { project_id, name } = req.body;
  pool.query('INSERT INTO tasks (project_id, task_name) VALUES ($1, $2)', [project_id, name], (error, results) => {
    if (error) {
      console.log('couldnt add task');
      throw error;
    }
    res.status(201).send(`Task added.`);
  });
});

// Get all tasks for a project
app.get('/tasks', (req, res) => {
  const { project_id } = req.body;
  pool.query('SELECT * FROM tasks WHERE project_id = $1', [project_id], (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});

// Get all tasks across projects
app.get('/tasks/all', (req, res) => {
  pool.query('SELECT * FROM tasks', (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
});


app.listen(3000, () => {
  console.log(`Server listening on port 3000`);
}); 
