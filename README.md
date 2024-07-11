# 💰 investAPI

Simple REST API for manage investments

## 📖 About

This project consists of a simple REST API for storing investments and displaying statistics over time. It is equipped with a token-based authentication system of two types: one for read-only access, freely obtainable from the appropriate route, and another with write permissions, obtainable through basic authentication. Both tokens are valid for only one operation, after that the token expires.

This project is purely educational, aimed at learning how to use the technologies employed.

## 🛠️ Stack

- Typescript
- Node.js with Express
- PostgreSQL with Prisma

## 📋 Prerequisites

You need to have Node.js (>= 22.2.0) installed locally and a PostgreSQL instance with a dedicated database.
Useful links:

- Node.js: https://nodejs.org/en/download/package-manager (using nvm is highly recommended)
- PostgreSQL: https://postgresapp.com

Once PostgreSQL is installed, you can create a new database with this command:
`sudo -u postgres psql -c 'create database investapi;'`

## 🚀 Installation

Clone this project to your local machine and run the command:
`npm install`

Next, in the root folder, create your `.env` file following the example provided in the `example.env` file.

Once you've created and filled out the .env file, run the following commands:

1. `npx prisma migrate dev --name init`
   This command will correctly create the project's logical schema in the database.

2. `npx prisma db seed`
   This command will seed the database with some example investments data and one registered user. It creates sample investments and adds a test user with the following credentials:
   `test username: testuser`
   `test password: testpassword`

Once all these operations have been completed correctly, it is possible to launch the service with the command `npm run dev`.

## 🧪 Testing

Inside the test folder, you can find a Postman Collection that can test the routes, with basic test scripts already integrated and a runner set up.
The collection is designed to automatically obtain a new token before each call that requires authentication. This process is fully automated within the Postman collection.
Username, password, tokens, and investment ID for some calls are saved in the Dev environment and automated.

## 🌐 API Routes

### Get Authorization Token

- **Method:** GET
- **Path:** `/api/authorization/`
- **Description:** Returns a JWT token. If the request is sent without authentication, it returns a token with read-only rights. If the request is made with basic authentication, it returns a token with read and write rights.
- **Authentication:** 
  - None: Results in read-only token
  - Basic Auth: Results in read-write token
- **Response:** JWT token

### Get All Investments

- **Method:** GET
- **Path:** `/api/investments/`
- **Description:** Returns a list of all investments.
- **Authentication:** Required (Read Only JWT token)
- **Response:** Array list of investment objects

### Get Investment by ID

- **Method:** GET
- **Path:** `/api/investments/:id`
- **Description:** Returns a specific investment given its ID.
- **Parameters:**
  - `id` (path parameter): The ID of the investment
- **Authentication:** Required (Read Only JWT token)
- **Response:** Single investment object

### Get Investment Statistics

- **Method:** GET
- **Path:** `/api/investments/stats`
- **Description:** Returns count and sum of investments in a given time range, grouped by day, week, month, or year.
- **Query Parameters:**
  - `startDate` (required): Start date of the range (ISO date format)
  - `endDate` (required): End date of the range (ISO date format)
  - `groupBy` (required): Grouping period (accepted: "day", "week", "month", or "year")
  - `includeUnconfirmed` (required): Whether to include unconfirmed investments (boolean)
- **Authentication:** Required (Read Only JWT token)
- **Response:** Statistics object with counts and sums grouped by the specified period

### Create New Investment

- **Method:** POST
- **Path:** `/api/investments/`
- **Description:** Inserts a new investment.
- **Authentication:** Required (JWT token with write permissions)
- **Request Body:**
  - `value` (required): The value of the investment (decimal)
  - `annualRate` (required): The annual rate of the investment (decimal)
  - `createdAt` (optional): The creation date of the investment (ISO date format). If not provided, the current date will be used.
  - `confirmDate` (optional): The confirmation date of the investment (ISO date format). Must not be earlier than `createdAt`.
- **Response:** Newly created investment object

### Update Investment Confirmation Date

- **Method:** PATCH
- **Path:** `/api/investments/`
- **Description:** Updates the confirmation date of an existing investment.
- **Authentication:** Required (JWT token with write permissions)
- **Request Body:**
  - `id` (required): The UUID of the existing investment to update
  - `confirmDate` (required): The new confirmation date (ISO date format). Must not be earlier than the investment's creation date.
- **Response:** Updated investment object

## 📃 License

[MIT](https://choosealicense.com/licenses/mit/)

## 📧 Contact Me

Any questions? Send me an e-mail here: [cristopherturazza@gmail.com](mailto:cristopherturazza@gmail.com)  
You can find my Linkedin profile here: [https://www.linkedin.com/in/cristopher-turazza-0863a026/](https://www.linkedin.com/in/cristopher-turazza-0863a026/)
