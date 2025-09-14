import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();

await connectDB();
await connectCloudinary();

app.use(cors());
app.use(clerkMiddleware())

app.get("/", (req, res) => {
  res.send("Hello World from Express!");
});
app.post("/clerk", express.json(), clerkWebhooks);
app.use('/api/educator',express.json(),educatorRouter)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
