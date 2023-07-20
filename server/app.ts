import express from "express";
import helmet from "helmet";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
// user defined
import connectDB from "./config";
import authRoutes from "./routes/auth.route";
import uploadRoutes from "./routes/upload";

const app = express();
app.use(compression());
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet({crossOriginResourcePolicy: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//Define Routes
app.use("/api/users", authRoutes());
app.use("/api/upload", uploadRoutes());

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("public"));
}

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  // start the Express server
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});