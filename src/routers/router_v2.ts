import express, {Request, Response} from "express";
import {getTasks, addTask, editTask, deleteTask} from "../controllers/dbcontroller";
import {login, logout, registration} from "../controllers/authcontroller";

const router = express.Router();
const path: string = '/router';

router.all(path, async (req: Request, res: Response) => {
    switch (req.query.action) {
        case ('login'): {
            await login(req, res);
            break;
        }
        case ('logout'): {
            await logout(req, res);
            break;
        }
        case ('register'): {
            await registration(req, res);
            break;
        }
        case ('getItems'): {
            await getTasks(req, res);
            break;
        }
        case ('createItem'): {
            await addTask(req, res);
            break;
        }
        case ('editItem'): {
            await editTask(req, res);
            break;
        }
        case ('deleteItem'): {
            await deleteTask(req, res);
            break;
        }
    }
});
export default router;