
const axios = require('axios');

const cors = require('cors');

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();

app.use(cors({
  origin: '*'
}));

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: '*',
  }});

const PORT = process.env.PORT || 3001;

let frameSrc = 'https://www.example.com'; // адрес фрейма по умолчанию
let frameTime = 0; // текущее время фрейма

// обработчик события подключения нового клиента
io.on('connection', (socket) => {
  // отправляем текущий адрес фрейма новому клиенту
  socket.emit('frameSrcChanged', frameSrc);

  // обработчик события изменения адреса фрейма
  socket.on('frameSrcChanged', async newFrameSrc => {
    frameSrc = newFrameSrc;
    io.emit('frameSrcChanged', frameSrc);
  });

  // обработчик события загрузки фрейма на клиенте
  socket.on('frameLoaded', () => {
    io.emit('frameLoaded'); // оповещаем всех клиентов о загрузке фрейма
  });

  // обработчик события получения времени фрейма от клиента
  socket.on('frameTime', (time) => {
    frameTime = time;
    io.emit('frameTime', frameTime); // отправляем текущее время фрейма всем клиентам
  });
});

app.get('/iframe', (req, res) => {
  const url = req.query.url;
  axios.get(url)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Ошибка получения данных');
    });
});

server.listen(PORT, function () {
  console.log('CORS-enabled web server listening on port ' + PORT);
});