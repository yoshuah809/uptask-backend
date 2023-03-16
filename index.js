import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import cors from "cors";

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

//Configure CORS
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    console.log(origin);
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Cors Error: " + origin));
    }
  },
};
app.use(cors(corsOptions));

//Routing
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`listening on Port ${PORT}`);
});
