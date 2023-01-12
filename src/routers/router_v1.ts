import express from "express";
import {addTask, deleteTask, editTask, getTasks} from "../controllers/dbcontroller";
import {login, logout, registration} from "../controllers/authcontroller";

const router = express.Router();
const path: string = '/items';
router.get(path, getTasks)
    .post(path, addTask)
    .put(path, editTask)
    .delete(path, deleteTask)
    .post('/login', login)
    .post('/logout', logout)
    .post('/register', registration);
export default router;