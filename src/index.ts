import express from "express";
import { setupPosts } from "./posts";
import { setupBlogs } from "./blogs";

const app = express();

setupPosts(app);
setupBlogs(app);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});