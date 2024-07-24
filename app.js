const express = require("express");
const dotenv = require("dotenv");
const prisma = require("./config/prisma");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(routes);

// start server
dotenv.config();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
