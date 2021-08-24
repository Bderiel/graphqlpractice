# graphqlpractice
## Running Server

- create postgres db named "dv01" like the connection string in the server/.env file at port 5411 or just change the connection string to whatever your db name or port is

- npm i
- npx prisma migrate dev --name init
- npm run seed
- npm start
