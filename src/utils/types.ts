import {ObjectId} from "mongodb";

export type Task = { id: string, text: string, checked: boolean };
export type User = { _id: ObjectId, login: string, pass: string, tasks: Array<Task> };