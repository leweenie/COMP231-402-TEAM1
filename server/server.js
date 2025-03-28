const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js")
const taskRoutes = require("./routes/taskRoutes.js")
const applicationRoutes = require("./routes/applicationRoutes.js")


dotenv.config(); 

const app = express();
app.use(cors());
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));
  
  app.use("/api/users", userRoutes);
  app.use("/api/jobs", taskRoutes);
  app.use("/api/applications", applicationRoutes);


  
  app.listen(5000, () => {
    console.log(`Server is running on 5000`);
  });