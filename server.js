const express = require('express');

const path = require('path');
const fs = require("fs");
const https = require("https");

const app = express();
const port = 2000;

// allow web access to files in the public folder (styles, scripts, html)
app.use(express.static('public'))


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/information', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/information.html'));
});


app.get('/extras', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/extraPage.html'));
});


app.get('/offline', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/offline.html'));
});

app.get('/offlineAjax', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/offlineAJAX.html'));
});

app.get('/getAjaxData', (req, res) => {
  res.send(`
    <div>
      <h2>Ajax request??!!</h2>
      <p>you wanted it, here's your data served!</p>
      <script>console.log("something important!")</script>
    </div>
  `);
});


const server = https.createServer({
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
},
  app
)

server.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
});
