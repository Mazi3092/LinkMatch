import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import LinksRouter from './Routers/LinksRouter.js';
import UsersRouter from './Routers/UsersRouter.js';
import LinksControllers from './Controllers/LinksControllers.js';
import Authorization from './Routers/Authorization.js';
import db from './db.js';
import Auth from './Controllers/Auth.js';
import AdvertisersRouter from './Routers/AdvertisersRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 9000;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(cors());

const dir = './uploads';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

db();

app.use('/users/del', UsersRouter);
app.get('/u/:uniqueName', LinksControllers.redirect);
app.use('/login/users', UsersRouter);
app.use('/signUp/users', UsersRouter);

app.use((req, res, next) => {
    try {
        let id = Auth.find((req.headers.authorization) || (req.body.headers.authorization));
        if (id != null) {
            req.id = id;
            next();
        } else {
            res.send('לא זוהה');
        }
    }
    catch (error) {
        console.log("ללבקתה אל");
        res.status(500).send({ message: 'not found' });
    } 
});

app.use("/links", LinksRouter);
app.use('/users', UsersRouter);
app.use('/advertisers', AdvertisersRouter);

app.use('/testAPI', Authorization);

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
