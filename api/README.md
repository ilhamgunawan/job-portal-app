## Getting Started

First, install the dependencies:
```bash
yarn install
```

Run the development server:

```bash
yarn start
```

The server should be running on [http://localhost:3030](http://localhost:3030)

## Endpoints
### Login
```
POST http://localhost:3030/api/login

/* Request body 
{
  "username": "ronaldo",
  "password": "ronaldo"
}

Available accounts:
- username: naruto password: naruto
- username: ronaldo password: ronaldo
*/
```

### Get Job List
```
GET http://localhost:3030/api/jobs?description=&location=&full_time=&page=2

/* Request query
- description: string
- location: string
- full_time: boolean
- page: int
*/
```

### Get Job Detail
```
GET http://localhost:3030/api/jobs/:id

/* Request param
- id: string
*/
```
