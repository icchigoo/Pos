const bodyParser = require("body-parser");
const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = 5000;
const authRouter = require("./routes/authRoute");
const ServiceRouter = require("./routes/serviceRoute");
const membershipTypeRouter = require("./routes/memberShipTypeRoute");
const memberRoute = require("./routes/memberRoute");
const companyRoute = require("./routes/companyRoute");
const transactionRoute = require ("./routes/transactionRoute");

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

app.use("/api/service", ServiceRouter);
app.use("/api/membershipType", membershipTypeRouter)
app.use("/api/member", memberRoute)
app.use("/api/company", companyRoute)
app.use("/api/transaction", transactionRoute)



app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});
