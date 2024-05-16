require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = 8000;
const connectDB = require("./utils/Dbconnection");

const app = express();
const router = require("./routes/userRoute");
const contactRoute = require("./routes/contactRoute");
const productRoute = require('./routes/productRoute')
const errorMiddleware = require("./middlewares/error-middleware");

const corsOptions = {
    origin: "http://localhost:3000",
    methods:"GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials:true,
}
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", router);
app.use("/api/form", contactRoute);
app.use("/api/data",productRoute);
app.use(errorMiddleware);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
  });
});
