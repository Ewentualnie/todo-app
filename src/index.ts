import express from 'express'
import cors from 'cors'
import session from './controllers/sessioncontroller';
import api_v1 from './routers/router_v1'
import api_v2 from './routers/router_v2'

const port: string = process.env.PORT ?? '3005';
const app = express();

app.use(session);
app.use(express.static('static'));
app.use(express.json());
app.use(cors({
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,POST,DELETE',
    origin: 'http://localhost:8080'
}));
app.use('/api/v1', api_v1);
app.use('/api/v2', api_v2);

app.listen(port, () => console.log("Server started on port: " + port));
