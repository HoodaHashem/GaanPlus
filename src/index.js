import express from "express";
import healthRouter from "./routes/health.js";
import 'dotenv/config'

const app = express()

const PORT = process.env.PORT || 3000

app.use("/api/v1/health", healthRouter)

app.listen(PORT, (err) => {
  if(err) console.log("Error starting the server");
  else console.log("Listening on =>", PORT)
})
