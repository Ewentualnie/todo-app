import {MongoClient, ObjectId, UpdateResult} from "mongodb";
import {Task, User} from "./utils/types";

const client = new MongoClient(`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.DATABASE}:27017`);
const users = client.db("mongoDb").collection("users");

export function load(userId: ObjectId): Promise<Array<Task> | undefined> {
    return client.connect()
        .then(() => users.findOne({_id: userId}))
        .then(user => user ? user.tasks : undefined);
}

export function add(task: Task, userId: ObjectId): Promise<boolean> {
    return client.connect()
        .then(() => users.updateOne(
            {_id: userId},
            {$push: {tasks: {id: (new ObjectId()).toString(), text: task.text, checked: false}}})
            .then(value => value.modifiedCount > 0));
}

export function edit(task: Task, userId: ObjectId): Promise<UpdateResult> {
    return client.connect()
        .then(() => users.updateOne(
            {_id: userId},
            {$set: {'tasks.$[element]': task}},
            {arrayFilters: [{"element.id": task.id}]}));
}

export function del(task: Task, userId: ObjectId): Promise<boolean> {
    return client.connect()
        .then(() => users.updateOne(
            {_id: userId},
            {$pull: {tasks: {id: task.id}}})
            .then(result => result.modifiedCount > 0));
}

export function addUser(user: User, pass: string): Promise<boolean> {
    return client.connect()
        .then(() => users.findOne({login: user.login})
            .then((oldUser) => oldUser ?
                false :
                users.insertOne({login: user.login, pass: pass, tasks: []}).then()
            ));
}

export function getUser(user: User): Promise<User | null> {
    return client.connect()
        .then(() => users.findOne<User>({login: user.login}));
}

client.connect().then(() =>
    console.log(`Connection to "${process.env.DATABASE}", like user: "${process.env.MONGO_USER}" with pass: "${process.env.MONGO_PASS}" is successful`)
);