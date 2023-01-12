import session from "express-session";
export const FileStore = require('session-file-store')(session);

export default session({
    store: new FileStore({}),
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
})