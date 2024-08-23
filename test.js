const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(morgan('combined')); // Logging
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const supabaseUrl = 'https://mgvvmoawequgfgqhvtwb.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

// Routes
app.get('/', (req, res) => {
    res.send("Hello, I am working with Supabase!");
  });

  app.get('/students', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('stud')
        .select('*');
  
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/student', async (req, res) => {
    try {
        // Ensure that the body data is properly parsed and validatedconst id = parseInt(req.body.id, 10);
        const age = req.body.age;
        const name = req.body.name; // Assuming name is a stringif (isNaN(id) || isNaN(age)) {
        
        const { error } = await supabase
            .from('stud')
            .insert([
                {
                    id: req.body.id,
                    name: name,
                    age: age
                }
            ]);

        if (error) throw error;

        res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
        console.error('Supabase Error:', error.message); // Improved error logging
        res.status(500).json({ error: `Product not created: ${error.message}` });
    }
});

// Delete a product by ID
app.delete('/students/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('stud')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Middleware to validate and sanitize update data
function validateUpdate(req, res, next) {
  const validFields = ['name', 'age']; // Add more fields here as needed
  req.updateData = {};

  validFields.forEach(field => {
    if (req.body[field] !== undefined) {
      req.updateData[field] = req.body[field];
    }
  });

  if (Object.keys(req.updateData).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  next();
}

app.put('/students/:id', validateUpdate, async (req, res) => {
  try {
    const { error } = await supabase
      .from('stud')
      .update(req.updateData)
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });