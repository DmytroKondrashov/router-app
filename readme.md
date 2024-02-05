# Project Local Setup

1. In your terminal, `cd` to the project’s folder.
2. Run the following command:
```bash
   yarn install
```
3. In the root of the project, create a file named `.env`.
4. Copy the data from `.env.example` file to `.env` file. For the purpose of this tech test app, you can actually use the values from the `.env.example` file for your local setup.
5. In the console, run the following command:
```bash
   yarn start
```
6. If you see the “node ./bin/www” line and no errors in the console, the app is running successfully on [http://localhost:3000](http://localhost:3000).

# User Flow Example

## Create User
- Endpoint: `POST http://localhost:3000/auth/register`
- Request Body should contain the “username” and “password” fields. For the purpose of this testing app, both these fields can have ordinary strings as their values:
    ```bash
    curl --location 'localhost:3000/auth/register' \
    --header 'Content-Type: application/json' \
    --data '{
        "username": "user7",
        "password": "password"
    }'
    ```
- Response (in case of successful user creation):
    ```json
    {
        "message": "User registered successfully"
    }
    ```

## Log In
- Endpoint: `POST http://localhost:3000/auth/login`
- Request Body:
    ```bash
    curl --location 'localhost:3000/auth/login' \
    --header 'Content-Type: application/json' \
    --data '{
        "username": "user7",
        "password": "password"
    }'
    ```
- Response (in case of successful logging in):
    ```json
    {
        "token": "some long token string"
    }
    ```

## Send Events
- Endpoint: `POST http://localhost:3000/events`
- Request Requirements:
    - Authorization header in the request.
- Request Body should contain a payload (any object), possibleDestinations (an array of  objects that consists of destinations names as keys and boolean as a value) and optional strategy string 'all', string 'any' or string serialized JS function that represent custom client defined strategy. When not specified, default app strategy will be used:
    ```bash
    curl --location 'localhost:3000/events' \
    --header 'Authorization: some long token' \
    --header 'Content-Type: application/json' \
    --data '{
        "payload": { "a": 1, "b": 2, "c": 3 },
        "possibleDestinations": [
            {
                "destination1": true,
                "destination2": false,
                "destination3": true
            },
            {
                "destination1": false,
                "destination2": false,
                "destination4": false
            },
            {
                "destination3": true
            }
        ],
        "strategy": "function(possibleDestinations) { return true; }"
    }'
    ```
- Response (in case of successful request):
    ```json
    {
        "destination1": true,
        "destination2": false,
        "destination3": true,
        "destination4": false
    }
    ```

# Other Endpoints

The app also contains the following endpoints:
- `POST http://localhost:3000/destinations/destination1`
- `GET http://localhost:3000/destinations/destination2`

These endpoints have no authorization or body/headers requirements and exist solely for being a destination for routing.
