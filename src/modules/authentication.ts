import express, { Request } from "express";
import { UserExample } from "../types/user-example";

export function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[]
  ): Promise<UserExample> {
    return new Promise((resolve, reject) => {
        if (securityName === "AuthToken") {
            let token;
            if (request.headers["x-auth"]) {
                token = request.headers["x-auth"];
            }
        
            // find authorization
            if (token === "abc123456") {
                // return auth data
                return resolve({
                    id: 1,
                    name: "Guy",
                });
            } else {
                return reject(new Error('Not Authorized'));
            }
        }
        
        return reject(new Error(`Missing Security '${securityName}'`));
    })
}

export interface AuthRequest extends Request {
    user: UserExample
}