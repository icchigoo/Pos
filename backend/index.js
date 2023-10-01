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
const membershiptypeRoute = require('./routes/membershiptypeRoute');
const supplierRoute = require('./routes/supplierRoute');
const taxRoute = require('./routes/taxRoute');
const openingRoute = require('./routes/openingRoute');
const purchaseRoute = require('./routes/purchaseRoute');
const customerRoute = require('./routes/customerRoute')
const salesRoute = require('./routes/salesRoute');
const inventorystockRoute = require('./routes/inventorystockRoute');
const companyRoute = require('./routes/companyRoute');


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
app.use("/api/supplier", supplierRoute);
app.use("/api/product",productRoute );
app.use("/api/stock",stock_adjustmentRoute );
app.use("/api/membershiptype",membershiptypeRoute );
app.use("/api/taxRoute",taxRoute );
app.use("/api/opening", openingRoute)
app.use("/api/purchase", purchaseRoute);
app.use("/api/customer",customerRoute);
app.use("/api/sales", salesRoute);
app.use('./api/inventory', inventorystockRoute);
app.use('./api/company', companyRoute);



app.use(notFound);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});
