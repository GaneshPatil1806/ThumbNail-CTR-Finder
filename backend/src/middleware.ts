import { NextFunction, Request, Response } from "express";
<<<<<<< HEAD
import { JWT_SECRET, WORKER_JWT_SECRET } from "./config";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
=======
import { JWT_SECRET,WORKER_JWT_SECRET} from "../config";
import jwt from "jsonwebtoken";
// WORKER_JWT_SECRET

export function authMiddleware(req: Request, res: Response, next: NextFunction) {

>>>>>>> origin/main
    const authHeader = req.headers["authorization"] ?? "";

    try {
        const decoded = jwt.verify(authHeader, JWT_SECRET);
<<<<<<< HEAD
        console.log(decoded);
=======
        //console.log(decoded);
>>>>>>> origin/main
        // @ts-ignore
        if (decoded.userId) {
            // @ts-ignore
            req.userId = decoded.userId;
            return next();
        } else {
            return res.status(403).json({
                message: "You are not logged in"
            })    
        }
    } catch(e) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
}

export function workerMiddleware(req: Request, res: Response, next: NextFunction) { 
    const authHeader = req.headers["authorization"] ?? "";

<<<<<<< HEAD
    console.log(authHeader);
=======
    //console.log(authHeader);
>>>>>>> origin/main
    try {
        const decoded = jwt.verify(authHeader, WORKER_JWT_SECRET);
        // @ts-ignore
        if (decoded.userId) {
            // @ts-ignore
            req.userId = decoded.userId;
            return next();
        } else {
            return res.status(403).json({
                message: "You are not logged in"
            })    
        }
    } catch(e) {
        return res.status(403).json({
            message: "You are not logged in"
        })
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/main
