import express, {
    Express,
    Response as ExResponse,
    Request as ExRequest,
    NextFunction,
} from "express";
import { ValidateError } from "tsoa";
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
import { NocoDB } from "./noco";
import { PaymentRow } from "../controllers/pi/pi";
import PiNetwork from "pi-backend";
import { PaymentDTO } from "pi-backend/dist/types";
import { PiService } from "../controllers/pi/piService";
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

        app.use(function errorHandler(
            err: unknown,
            req: ExRequest,
            res: ExResponse,
            next: NextFunction
          ): ExResponse | void {
            if (err instanceof ValidateError) {
              console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
              return res.status(422).json({
                message: "Validation Failed",
                details: err?.fields,
              });
            }
            if (err instanceof Error) {
              return res.status(500).json({
                message: "Internal Server Error",
              });
            }
            console.log('ERROR', err);
            
          
            next();
          });
            
        RegisterRoutes(this.app);

        let { apiKey, privateSeed } = global.config.pi;
        let pi = new PiNetwork(apiKey, privateSeed);
        pi.getIncompleteServerPayments().then(async (result: unknown) => {
          let payments = (<{incomplete_server_payments: Array<PaymentDTO>}> result).incomplete_server_payments;
          console.log('Payments:', payments);
          for(let payment of payments) {
            let complete = await PiService.completeServerPayment(pi, payment)
            console.log(complete);
            
            // await PiService.cancelServerPayment(pi, payment);
          }
        })
        
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