const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const authRoutes =
  require("./routes/authRoutes");

const transactionRoutes =
  require("./routes/transactionRoutes");

const categoryRoutes =
  require("./routes/categoryRoutes");

const app = express();


// MIDDLEWARES
app.use(
  cors({
    origin: "*",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
    credentials: true,
  })
);

app.use(express.json());


// ROUTES
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/transactions",
  transactionRoutes
);

app.use(
  "/api/categories",
  categoryRoutes
);


// TEST ROUTE
app.get("/", (req, res) => {

  res.send(
    "API Running Successfully"
  );
});


const PORT =
  process.env.PORT || 5000;


app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});