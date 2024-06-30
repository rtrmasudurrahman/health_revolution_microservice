**_Third Party Libraries_**
Express
Cors
dotenv = Environment
morgan = View Log
zod = Validation

**_Third Party Typescript Libraries (For Dev Dependencies)_**
typescript
tsc
ts-node-dev
tsc-alias
tsconfig-paths
@types/express
@types/node
@types/corse
prisma
@prisma/client

**_This will be prisma/clecnt command_**
yarn add @prisma/client

**_This will be prisma postgresql command_**
npx prisma init --datasource-provider postgresql

**_Complete the model and schemas then run command with customize .env database url_**
yarn migrate:dev

**_project run command_**
yarn dev

**_Endpoints example_**
POST /products - Create a new product
PUT /products - Update a product
GET /products/:id - Get product Details
GET /products - Get all product
DELETE /products/:id - Delete Product
