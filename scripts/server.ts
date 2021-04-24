import service from 'bonjour';
import express from 'express';

const bonjour = service();
const app = express();

app.use((req, res) => {
  console.log(`Received request: ${req.ip}`);
  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log(`Listening on port: ${3000}`);
});

bonjour.publish({name: 'http_server_middleware', type: 'http', port: 3000});
