import { Express, NextFunction, Request, Response } from 'express';
import express from 'express';
import session from 'express-session';
import Cors from 'cors';
import http from 'http';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
/*
    Type Definitions
*/
import { Server } from 'node:http';
import { RegisterRoutes } from '../routes/routes';
import * as swaggerJson from '../routes/swagger.json';
// import Routes from '../routes/routes';

export class Main {
    httpServer: Server;

    constructor(
        private app: Express
    ) {
        this.app.set('trust proxy', 1);
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(Cors());
        this.app.use(session({
            secret: 'asd876asd876sa876zxcy8ta786t',
            resave: true,
            saveUninitialized: true,
            cookie: {
                expires: new Date(new Date().getTime() + 300000),
                secure: false,
                sameSite: true
            }
        }));

        this.app.use(express.static(path.join(global.paths.root, 'public')));

        app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerJson)
        );

        RegisterRoutes(this.app);

        this.httpServer = http.createServer(this.app);
        this.serverListen();
    }

    async serverListen() {
        let port = global.config.port || 3000
        this.httpServer.listen(port, () => {
            console.log('> HTTP listening on port: ' + port);
        })
    }
}