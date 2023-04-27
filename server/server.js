const express = require('express');
const app = express();
const path = require('path');
const { Pool } = require('pg');

// Connect to ElephantSQL database
const connectionString =
  'postgres://bfhnryrl:RJPG8wjo6uwrd6zT-ieAyPzrkM-VLGUq@mahmud.db.elephantsql.com/bfhnryrl';

const pool = new Pool({
  connectionString,
});

// removes unique restraint on the name column in projects table

pool.connect();

// 

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Serve index.html on root
app.get('/', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  return res.status(200).sendFile(path.join(__dirname, '../index.html'));
});

// Get all users
app.get('/users', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
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
  pool.query(
    'INSERT INTO users (name) VALUES ($1)',
    [name],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.set('Access-Control-Allow-Origin', '*');
      res.status(201).send(`User added.`);
    }
  );
});

// Add new project
// Req body should include user_id and name
app.post('/projects', (req, res) => {
  const { user_id, name } = req.body;
  pool.query(
    'INSERT INTO projects (user_id, name) VALUES ($1, $2)',
    [user_id, name],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.set('Access-Control-Allow-Origin', '*');
      res.status(201).send(`Project added.`);
    }
  );
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

// Get all projects for a user
app.get('/projects/:id', (req, res) => {
  const { id } = req.params;
  pool.query(
    'SELECT * FROM projects WHERE user_id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.set('Access-Control-Allow-Origin', '*');
      res.status(200).json(results.rows);
    }
  );
});

// Add new task
// Req body should include project_id and task name
app.post('/tasks', (req, res) => {
  const { project_id, name , status} = req.body;
  pool.query(
    'INSERT INTO tasks (project_id, task_name, status) VALUES ($1, $2, $3)',
    [project_id, name, status],
    (error, results) => {
      if (error) {
        console.log('couldnt add task');
        throw error;
      }
      res.set('Access-Control-Allow-Origin', '*');
      res.status(201).send(`Task added.`);
    }
  );
});

// Get all tasks across projects
app.get('/tasks/all', (req, res) => {
  pool.query('SELECT * FROM tasks', (error, results) => {
    if (error) {
      throw error;
    }
    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).json(results.rows);
  });
});

// Get all tasks for a project
app.get('/tasks/:id', (req, res) => {
  const { id } = req.params;
  pool.query(
    'SELECT * FROM tasks WHERE project_id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.set('Access-Control-Allow-Origin', '*');
      res.status(200).json(results.rows);
    }
  );
});

// Updates title for a project
app.put('/projects/:id', async (req, res) => {
  const id = req.params.id;
  const newName = req.body.name;
  try {
    const result = await pool.query('UPDATE projects SET name = $1 WHERE id = $2', [newName, id]);
    if (result.rowCount === 0) {
      res.status(404).send(`Project with ID ${id} not found`);
    } else {
      res.set('Access-Control-Allow-Origin', '*');
      res.status(200).send();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating project');
  }
})

// Updates title/body on a task
// not sure how tasks will be implemented yet
app.put('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  const newName = req.body.name;
  const newBody = req.body.body
  try {
    const result = await pool.query('UPDATE tasks SET task_name = $1, description = $2 WHERE id = $2', [newName, newBody, id]);
    if (result.rowCount === 0) {
      res.status(404).send(`Task with ID ${id} not found`);
    } else {
      res.set('Access-Control-Allow-Origin', '*');
      res.status(200).send();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating task');
  }
})

// Deletes project
app.delete('/projects/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).send(`Project with ID ${id} not found`);
    } else {
      res.set('Access-Control-Allow-Origin', '*');
      res.status(204).send();

    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting project');
  }
});

// Deletes task
app.delete('/tasks/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      res.status(404).send(`Project with ID ${id} not found`);
    } else {
      res.set('Access-Control-Allow-Origin', '*');
      res.status(204).send();

    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting project');
  }
});

app.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});
