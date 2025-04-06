const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes.js")
const taskRoutes = require("./routes/taskRoutes.js")
const applicationRoutes = require("./routes/applicationRoutes.js")
const reviewRoutes = require("./routes/reviewRoutes.js")


dotenv.config(); 

const app = express();
app.use(cors());
const path = require("path");

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));
  
  app.use("/api/users", userRoutes);
  app.use("/api/jobs", taskRoutes);
  app.use("/api/applications", applicationRoutes);
  app.use("/api/reviews", reviewRoutes);


  
  app.listen(5000, () => {
    console.log(`Server is running on 5000`);
  });