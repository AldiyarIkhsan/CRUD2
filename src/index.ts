import express from "express";
import { setupBlogs } from "./blogs";

const app = express();
app.use(express.json());

setupBlogs(app);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
