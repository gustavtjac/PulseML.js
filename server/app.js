import 'dotenv/config';

import express from 'express';

import session from 'express-session';

import { rateLimit } from 'express-rate-limit';

import helmet from 'helmet';

import authRouter from './routers/authRouter.js';

import countriesRouter from './routers/countriesRouter.js';

import usersRouter from './routers/usersRouter.js';

import gamesRouter from './routers/gamesRouter.js';

import scoresRouter from './routers/scoresRouter.js';

import http from 'http';

import { Server } from 'socket.io';

import path from 'path';
const app = express();

app.use(express.static('../client/dist'));
app.use(express.json({ limit: '5mb' }));
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
});

app.use(sessionMiddleware);
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    skip: (req) => req.path === '/auth/me',
    message: {
        data: {
            errorMessage: 'Too many auth attempts, please try again later',
        },
    },
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: {
        data: { errorMessage: 'Too many attempts, please try again later' },
    },
});
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                'img-src': ["'self'", 'data:', 'https://flagcdn.com'],
                'script-src': [
                    "'self'",
                    "'wasm-unsafe-eval'",
                    'https://cdn.jsdelivr.net',
                ],
                'connect-src': ["'self'", 'https://cdn.jsdelivr.net'],
                'worker-src': ["'self'", 'blob:'],
            },
        },
    }),
);

app.use('/auth', authLimiter);
app.use(generalLimiter);
app.use(authRouter);
app.use(countriesRouter);
app.use(usersRouter);
app.use(gamesRouter);
app.use(scoresRouter);
const server = http.createServer(app);
const io = new Server(server);

export { io };

io.engine.use(sessionMiddleware);

app.get('/api/{*splat}', (req, res) => {
    res.status(404).send({
        data: { errorMessage: `${req.method} ${req.path} does not exist` },
    });
});
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.resolve('../client/dist/index.html'));
});

app.all('/{*splat}', (req, res) => {
    res.status(404).send({
        data: { errorMessage: `${req.method} ${req.path} does not exist` },
    });
});

const PORT = process.env.PORT ?? 8080;

server.listen(PORT, () => {
    console.log('Server is running on port ' + server.address().port);
});
