import router from "./routes/index.js"
import bodyParser from "body-parser";
import express from "express";

const port = 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/", router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
});

export default app;
