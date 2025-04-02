import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import * as dotenv from "dotenv"
import PostRouter from "./routes/Posts.js"
import GenerateImageRouter from "./routes/GenerateImage.js"

dotenv.config();

const app = express();
// Updated CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://precious-bublanina-5be943.netlify.app'],
  credentials: true
}));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true}));

// Add a test endpoint
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

//error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

app.use("/api/post", PostRouter);
app.use("/api/generateImage", GenerateImageRouter);

//Default get
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Hello from server",
    });
});
//function to connect MongoDB
const connectDB = async () => {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("Failed to Connect to Database");
        console.error(err); 
    });
};

//function ot start the sercer
const startServer = async () => {
    try {
        connectDB();
        app.listen(8080, () => console.log("Server started on port 8080"));
    } catch (error) {
        console.log(error);
    }
};

startServer();