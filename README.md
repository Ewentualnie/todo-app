#### by Serhii Zaika

# TODO application

## You need Docker to run it!

## Steps to launch:

#### - Include `mongo.env` file with environment variables for `MongoDB`

---
Environment variables include:

- `MONGO_INITDB_ROOT_USERNAME` (Name of user)
- `MONGO_INITDB_ROOT_PASSWORD` (User's password)

#### - Include `app.env` file with environment variables for connection to `MongoDB`

Environment variables include:

- `MONGO_USER` (Username of user that can access database)
- `MONGO_PASS` (Password of user that can access database)
- `DATABASE` (Database name)

---

#### Go to app directory

#### Run with the following command

```shell
docker-compose up
```