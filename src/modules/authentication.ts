import express, { Request } from "express";
import { UserExample } from "../types/user-example";

export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
  ): Promise<UserExample> {
    if (securityName === "AuthToken") {
        let token;
        if (request.headers["x-auth"]) {
            token = request.headers["x-auth"];
        }
    
        // find authorization
        if (token === "abc123456") {
            // return auth data
            return Promise.resolve({
                id: 1,
                name: "Guy",
            });
        } else {
            return Promise.reject(new Error('un authorized'));
        }
    } else return Promise.reject(new Error('un authorized'));
}

export interface AuthRequest extends Request {
    user: UserExample
}