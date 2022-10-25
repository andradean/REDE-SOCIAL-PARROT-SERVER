import express from 'express';
import * as http from 'http';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { debug } from 'debug';
import { CommonRoutesConfig } from '../../adapter/apis/routes/common.routes.config';
import { UsersRoutes } from '../../adapter/apis/routes/users.routes';
import {PostRoutes} from '../../adapter/apis/routes/post.routes'




const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 8000;
const routes: CommonRoutesConfig[] = [];
const debugLog: debug.IDebugger = debug('app');
import handleError from '../../adapter/middlewares/handle.error.helper.adapter'

app.use(express.json());
app.use(cors());
app.use(handleError);

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
}

if(!process.env.DEBUG) {
    loggerOptions.meta = false;
}

app.use(expressWinston.logger(loggerOptions));

routes.push(new UsersRoutes(app));
routes.push(new PostRoutes(app));



const runningMessage = `Servidor rodando na porta ${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage);
})

server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Rotas configuradas para ${route.getName()}`);
    });
    console.log(runningMessage);
});

export default app