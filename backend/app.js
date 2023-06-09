const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv/config");
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const router = express.Router();

// Swagger Section
// Extended: https://swagger.io/specification/#infoObject
// const swaggerOptions = {
//     swaggerDefinition: {
//         info: {
//             title: 'Eshop API',
//             version: "1.0.0",
//             description: "Eshop API Information",
//             contact : {
//                 name: "Andy Short"
//             },
//             servers: [
//                 {
//                     url: 'http://localhost:3000'
//                 }
//             ],
//         }
//     },
//     apis: ["./routes/*.js"]
// }

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Automation 101 EShop",
            version: "1.0.0",
            description: "Automation 101 EShop API"
        },
        servers: [
            {
                url: "https://eshop-backend-101.herokuapp.com"
            }
        ],
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


// Cors
app.use(cors());
app.options("*", cors());


// Middleware - for dealing with JSON objects posted from the frontend
app.use(express.json());
app.use(morgan("tiny"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(authJwt());
app.use(errorHandler);


//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

const api = process.env.API_URL;

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);


// Connection to MongoDB database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // dbName: 'eshop-database'
    dbName: process.env.DB_NAME
})
.then(() => {
    console.log('We are using ' + process.env.DB_NAME);
    console.log('Database connection is ready');
})
.catch((err)=> {
    console.log(err);
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server is running http://localhost:3000');
})

