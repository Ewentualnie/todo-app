import {Request, Response} from "express";
import {addUser, getUser} from "../mongo";
import {FileStore} from './sessioncontroller'
import generateHash from "./hashcontroller";

const ok: { ok: boolean } = {ok: true};

export function login(req: Request, res: Response): void {
    getUser(req.body)
        .then((user) => {
            if (user && user.pass == generateHash(req.body)) {
                FileStore[req.sessionID] = {userId: user._id}
                res.status(200).send(JSON.stringify(ok));
            } else {
                res.status(404).send(JSON.stringify({error: 'not found'}));
            }
        })
}

export function logout(req: Request, res: Response): void {
    req.session.destroy(() =>
        res.status(200).send(JSON.stringify(ok)));
}

export function registration(req: Request, res: Response) {
    addUser(req.body, generateHash(req.body))
        .then((exist) => exist ?
            res.status(200).send(JSON.stringify(ok)) :
            res.status(404).send(JSON.stringify({error: 'user already exists!'})));
}