import express from "express";
import { setupBlogs } from "./blogs";
import { setupPosts } from "./posts";
import { setupTesting } from "./testing";

const app = express();
app.use(express.json());

setupBlogs(app);
setupPosts(app);
setupTesting(app);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});