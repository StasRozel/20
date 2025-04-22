const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'public')));

// Setup handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    cancelButton: function() {
      return new Handlebars.SafeString('<a href="/" class="cancel-button">Отказаться</a>');
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Helper function to read phonebook data
function readPhonebook() {
  try {
    const data = fs.readFileSync('phonebook.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading phonebook data:', error);
    return [];
  }
}

// Helper function to write phonebook data
function writePhonebook(data) {
  try {
    fs.writeFileSync('phonebook.json', JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing phonebook data:', error);
    return false;
  }
}

// Routes
// GET: / - Display phone list with add button
app.get('/', (req, res) => {
  const phonebook = readPhonebook();
  res.render('home', { 
    phonebook,
    title: 'Телефонный справочник',
    isHome: true
  });
});

// GET: /add - Form to add a new phone entry
app.get('/add', (req, res) => {
  const phonebook = readPhonebook();
  res.render('add', {
    phonebook,
    title: 'Добавить контакт',
    disableRows: true
  });
});

// POST: /add - Add a new phone entry
app.post('/add', (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).send('Name and phone are required');
  }

  const phonebook = readPhonebook();
  const newEntry = {
    id: phonebook.length > 0 ? Math.max(...phonebook.map(entry => entry.id)) + 1 : 1,
    name,
    phone
  };

  phonebook.push(newEntry);
  writePhonebook(phonebook);
  res.redirect('/');
});

// GET: /update/:id - Form to update a phone entry
app.get('/update/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const phonebook = readPhonebook();
  const contact = phonebook.find(entry => entry.id === id);
  
  if (!contact) {
    return res.status(404).redirect('/');
  }
  
  res.render('update', {
    phonebook,
    contact,
    title: 'Изменить контакт',
    disableRows: true
  });
});

// POST: /update - Update a phone entry
app.post('/update', (req, res) => {
  const { id, name, phone } = req.body;
  if (!id || !name || !phone) {
    return res.status(400).send('ID, name and phone are required');
  }

  const numericId = parseInt(id);
  const phonebook = readPhonebook();
  const index = phonebook.findIndex(entry => entry.id === numericId);
  
  if (index === -1) {
    return res.status(404).redirect('/');
  }
  
  phonebook[index] = { id: numericId, name, phone };
  writePhonebook(phonebook);
  res.redirect('/');
});

// POST: /delete - Delete a phone entry
app.post('/delete', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).send('ID is required');
  }

  const numericId = parseInt(id);
  const phonebook = readPhonebook();
  const updatedPhonebook = phonebook.filter(entry => entry.id !== numericId);
  
  writePhonebook(updatedPhonebook);
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
