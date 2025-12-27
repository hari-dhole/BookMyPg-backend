require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // connect the database
  await connectDB();

  app.listen(PORT, () => console.log(`Server started at port ${PORT}...`));
};

startServer();
