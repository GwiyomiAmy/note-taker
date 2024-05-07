const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');

app.use(clog);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'db/db.json'))
);

app.post('/api/notes', (req, res) => {
   console.info(`${req.method} request received`);
 
   const { title, text } = req.body;
 
   if (title && text) {
     const newEntry = {
       title,
       text,
     };
 
     fs.readFile('./db/db.json', 'utf8', (err, data) => {
       if (err) {
         console.error(err);
       } else {
         const parsedEntries = JSON.parse(data);
 
         parsedEntries.push(newEntry);
 
         fs.writeFile(
           './db/db.json',
           JSON.stringify(parsedEntries, null, 4),
           (writeErr) =>
             writeErr
               ? console.error(writeErr)
               : console.info('Successfully updated reviews!')
         );
       }
     });
 
     const response = {
       status: 'success',
       body: newEntry,
     };
 
     console.log(response);
     res.status(201).json(response);
   } else {
     res.status(500).json('Error in posting review');
   }
});
 
app.get('*', (req, res) =>
res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);