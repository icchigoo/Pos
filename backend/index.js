const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = 5000;
const authRouter = require("./routes/authRoute");
const groupRoute = require("./routes/groupRoute");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require('./routes/productRoute');
const stock_adjustmentRoute = require('./routes/stock_adjustmentRoute')
const supplierRoute = require('./routes/supplierRoute')


const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

dbConnect();
app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/api/user", authRouter);
app.use("/api/group", groupRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product",productRoute );
app.use("/api/stock",stock_adjustmentRoute );
app.use("/api/stock",supplierRoute );



app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});
