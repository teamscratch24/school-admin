

const express = require("express");
require("dotenv").config();
const dbConnection = require("./Db/dbConnection");
const rateLimit = require('express-rate-limit');
const fileUpload = require('express-fileupload');
const authRouter = require("./Routers/AuthRouter");
const EventRouter = require("./Routers/EventRouter");
const AdminRouter = require("./Routers/AdminRouter");
const AnnoncementRouter = require("./Component/Annoncement");
const cors = require("cors");
const helmet = require("helmet");
const AuthCheck = require("./Middlewere/AuthMiddle");
const { CreateSuperAdmin } = require("./Component/Auth");
const app = express();

const port = 5000 || process.env.PORT ;

app.use(cors())
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }
}));
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
   message: {
    msg: 'Too many requests, please try again later.'
  },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 120,
   message: {
    msg: 'Too many requests, please try again later.'
  },
});

app.use("/api/admin/login",loginLimiter,authRouter); 
app.use("/api/admin/event",apiLimiter,EventRouter);   
app.use("/api/admin/announcements",apiLimiter, AnnoncementRouter);
app.use("/api/admin",loginLimiter,AuthCheck,AdminRouter); 



async function startServer() {
  try {
    await dbConnection()
    await CreateSuperAdmin();
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}   );

server.on("request", (req) => {
    console.log(`${req.method} ----> ${req.url}`);   
});
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();



