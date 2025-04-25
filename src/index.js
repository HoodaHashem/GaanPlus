import express from "express";
import healthRouter from "./routes/health.js";
import 'dotenv/config'
import authRouter from "./routes/auth.js";
import adminRouter from "./routes/admin.js";

const app = express()

const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// this route is for development purposes only
// it should not be used in production
// its purpose is to help developers test the api
app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/health", healthRouter)
app.use("/api/v1/auth", authRouter);

app.listen(PORT, (err) => {
  if(err) console.log("Error starting the server");
  else console.log("Listening on =>", PORT)
})
