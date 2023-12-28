import path from 'path';
import Express from 'express';
const app = Express();

import { Main } from "./modules/main";
import { ConfigType, Config } from './config';

/*
    Setup global type definitions to allow custom object onto the global object
    these definitions are then available across all sub modules
*/
declare global {
    var paths: { [key:string]: string; };
    var config: ConfigType;
}

let root = path.join(__dirname, '../')
global.paths = {
    root,
    public: path.join(root, 'public')
}
global.config = Config;

const main = new Main (
    app
);

