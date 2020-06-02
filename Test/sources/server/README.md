# OhStore Server API
## Based on [Sails.js](http://sailsjs.com/) (v1.0)

A product of AITT

## Config
Install MySQL and create new schema with name ohstore. Run queries below to update DB root password. You can change to your password.
```bash
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;
```

Edit `config/datastores.js` and update database connection string:
```bash
mysql://root:password@host:port/ohstore
```

## Install
```bash
npm install sails -g
npm install
```

## Start server
```bash
npm start
```

## Create database schema and sample data
Only needed when you run at first time or need to recreate database.
Edit config/env/development.js, change from 'safe' to 'drop', database_seeding from false to true.

```bash
models: {
  migrate: 'drop'
},
database_seeding: true, // create sample data or not
```

You should turn off database_seeding option for next run or you will get error due to duplicated record created for sample data.

## Database migration
We are using db-migrate to handle database migration. All migration scripts are in folder /migrations.

### Create/drop database
```bash
db-migrate db:drop ohstore
db-migrate db:create ohstore
```
### Run migration
```bash
db-migrate up
db-migrate down
```
Run migration for specific env, for example, production
```bash
db-migrate up -e prod
```
Run all down migrations and literally reset all migrations which where currently done
```bash
db-migrate reset
```
### Create new migration
Creates a migration that loads sql file with the name migrationname in migrations directory. 
```bash
db-migrate create migrationname
```

## Pass JWT authentication

Token-free endpoints: 
```
/users/signup
/users/login
```  

Token-required endpoints: 
```
/users/login
```

To pass a JWT use `Authorization` header: 
```
Authorization: JWT <JWT>
```

## API methods
Defagult Base API URL: `http://localhost:1337`
#### `POST /users/signup` 
Creates a new user.

__request__ 
```json
{
  "email": "email@example.com",
  "fullName": "A B C",
  "password": "abc123"
}
```

__response__
```json
OK
```


#### `POST /users/login` 
__request__ 
```json
{
  "email": "email@example.com",
  "password": "abc123"
}
```

__response__
```json
{
  "token": "<JWT>"
}
```

#### `PUT /users/profile` 
__request__ 
```json
{
  "email": "email@example.com",
  "fullName": "New Name"
}
```

__response__
```json
OK
```

## Developemt documents

+ [Sails framework documentation](https://sailsjs.com/get-started)
+ [Version notes / upgrading](https://sailsjs.com/documentation/upgrading)
+ [Deployment tips](https://sailsjs.com/documentation/concepts/deployment)
+ [Community support options](https://sailsjs.com/support)
+ [Professional / enterprise options](https://sailsjs.com/enterprise)
