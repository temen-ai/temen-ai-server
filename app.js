import router from "./routes/index.js"
import cookieParser from "cookie-parser";
import logger from "morgan";
import express from "express";
import cors from "cors";

const port = 3000;
const app = express();
// server configuration
app.use((err, req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next(err);
});
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", router); // load the router module

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});

export default app;
