import {add, del, edit, load} from '../mongo'
import {Request, Response} from "express";
import {FileStore} from './sessioncontroller'


export function getTasks(req: Request, res: Response) {
    if (FileStore[req.sessionID] != undefined && FileStore[req.sessionID].userId != undefined) {
        load(FileStore[req.sessionID].userId).then((value) => value ?
            res.status(200).send(JSON.stringify({items: value})) :
            res.status(404).send(JSON.stringify({error: "can't load tasks"})));
    } else {
        res.status(403).send(JSON.stringify({error: 'forbidden'}));
    }
}

export function addTask(req: Request, res: Response) {
    add(req.body, FileStore[req.sessionID].userId).then(value => value ?
        res.status(200).send(JSON.stringify({id: value})) :
        res.status(404).send(JSON.stringify({error: "can't add task"})));
}

export function editTask(req: Request, res: Response) {
    edit(req.body, FileStore[req.sessionID].userId).then(value => value ?
        res.status(200).send(JSON.stringify(value)) :
        res.status(404).send(JSON.stringify({error: "can't edit task"})));
}

export function deleteTask(req: Request, res: Response) {
    del(req.body, FileStore[req.sessionID].userId).then(value => value ?
        res.status(200).send(JSON.stringify({ok: value})) :
        res.status(404).send(JSON.stringify({error: "can't delete task"})));
}