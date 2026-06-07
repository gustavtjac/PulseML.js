import 'dotenv/config';

import express from 'express';
const app = express();

app.use(express.static('../client/dist'));
app.use(express.json({ limit: '5mb' }));

import session from 'express-session';
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
});

app.use(sessionMiddleware);

import { rateLimit } from 'express-rate-limit';
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

import helmet from 'helmet';
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

import authRouter from './routers/authRouter.js';
app.use(authRouter);

import countriesRouter from './routers/countriesRouter.js';
app.use(countriesRouter);

import usersRouter from './routers/usersRouter.js';
app.use(usersRouter);

import gamesRouter from './routers/gamesRouter.js';
app.use(gamesRouter);

import scoresRouter from './routers/scoresRouter.js';
app.use(scoresRouter);

import http from 'http';
const server = http.createServer(app);

import { Server } from 'socket.io';
const io = new Server(server);

io.engine.use(sessionMiddleware);

import { leaderboardBannerSocket } from './sockets/leaderboardBannerSocket.js';
leaderboardBannerSocket(io);

import { leaderboardSocket } from './sockets/leaderboardSocket.js';
leaderboardSocket(io);

app.get('/api/{*splat}', (req, res) => {
    res.status(404).send({
        data: { errorMessage: `${req.method} ${req.path} does not exist` },
    });
});

import path from 'path';
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
