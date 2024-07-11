# investAPI

Simple REST API for manage investments

## About

This project consists of a simple REST API for storing investments and displaying statistics over time. It is equipped with a token-based authentication system of two types: one for read-only access, freely obtainable from the appropriate route, and another with write permissions, obtainable through basic authentication.\
This project is purely educational, aimed at learning how to use the technologies employed.

## Stack

- Typescript
- Node.js with Express
- PostgreSQL with Prisma

## Prerequisites

You need to have Node.js (>= 22.2.0) installed locally and a PostgreSQL instance with a dedicated database.\
Useful links:

- Node.js: https://nodejs.org/en/download/package-manager (nvm is highly recommended)
- PostreSQL: https://postgresapp.com

## Install

Clone this project to your local machine and run the command:
`npm install`

Next, in the root folder, create your .env file following the example provided in the example.env file.
\

Once you've created and filled out the .env file, run the following command:
`npx prisma migrate dev --name init`
to correctly create the project's logical schema in the database
