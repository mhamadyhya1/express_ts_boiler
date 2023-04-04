import express, { Express } from 'express';
import dotenv from 'dotenv';
import routes from './src/init/routes';
import db from './src/init/db';
import theApp from './src/init/theApp';
import ratelimit from 'express-rate-limit';
dotenv.config();
const app: Express = express();

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));
theApp(app);
db();
routes(app);

function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))));
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))));
  } else if (layer.method) {
    console.log('%s /%s', layer.method.toUpperCase(), path.concat(split(layer.regexp)).filter(Boolean).join('/'));
  }
}

function split(thing) {
  if (typeof thing === 'string') {
    return thing.split('/');
  } else if (thing.fast_slash) {
    return '';
  } else {
    const match = thing
      .toString()
      .replace('\\/?', '')
      .replace('(?=\\/|$)', '$')
      .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//);
    return match ? match[1].replace(/\\(.)/g, '$1').split('/') : '<complex:' + thing.toString() + '>';
  }
}

app._router.stack.forEach(print.bind(null, []));

app.listen(3000, () => {
  console.log(`⚡️ [server]: Server is running at https://localhost:${3000}`);
});
export default app;
