const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// return pages in the public folder (styles and scripts)
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/information', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/information.html'));
});

app.get('/getAjaxData', (req, res) => {
  res.send(`
    <div>
      <h2>Ajax request!!</h2>
      <p>you wanted it, here's your data served!</p>
      <script>console.log("something important!")</script>
    </div>
  `);
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
