import service from 'bonjour';
import express from 'express';
import bodyParser from 'body-parser';
import {IObdResponse} from '../src/obd/obdTypes';

const bonjour = service();
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({}));

let globalObdState: {[pid: string]: IObdResponse} = {};

app.post('/obd/save-data', (req, res) => {
  const body: {[pid: string]: IObdResponse} = req.body;
  globalObdState = {...globalObdState, ...body};
  console.log(globalObdState, body);
  res.sendStatus(200);
});

app.get('/obd/get-data', (req, res) => {
  res.send(JSON.stringify(globalObdState));
});

app.use((req, res) => {
  res.sendStatus(400);
});

app.listen(3000, () => {
  console.log(`Listening on port: ${3000}`);
});

bonjour.publish({name: 'http_server_middleware', type: 'http', port: 3000});
