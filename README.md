
# How to install

Start docker compose
```bash
$ docker-compose up -d
```
Enter the container with app
```bash
$ docker exec -it <container_name> bash
```
You can run tests in test database
```bash
$ npm run test
```
Or you can seed user and try it on port localhost:8080
```bash
$ npm run seed
```

Login endpoint, credentials for seeded user are email: test@email.com password: test
```bash
$ POST /v1/login
```

# Considerations when building the app

## Docker
I used docker compose to make it simple for other to run this app and have same enviroment.
There are 2 database container one is for test database and other is for regular database when running locally. Third container is the node.js application itself.

## Project settings
I used prettier so all developers would use same code style. 
For routing it uses routing-controllers library with class-validator.

## Tests
This projec uses Jest and Supertest to test the application. Supertest is used to send requests to the application and then it tests for expected responses or status codes.
There is also example of test that tests if user is not authorized he cant access the endpoint.

## Database
It uses postgres db and typeorm. I used synchronization so the models are automatically create in the database without the need of migrations. I think for this purpose it is ok, but NOT suitable for production.

## Authentication
I implemented simple authentication with jwt. After successful login the app returns token which is valid for 1 hour. It is signed using server secret so users cant modify it or impersonate other users. Advantage of this is less load on database because the user is self contained in the token so there is no need to run db query on every single request to authorize the user for given endpoint.




