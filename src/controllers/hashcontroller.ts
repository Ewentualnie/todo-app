import crypto from 'crypto';
import {User} from "../utils/types";

const generateHash = (user: User): string =>
    crypto.createHmac('sha256', user.login)
        .update(user.pass)
        .digest('hex');
export default generateHash;