import { Express, Request, Response } from "express";
import { blogValidationRules, handleInputErrors, basicAuthMiddleware } from "./middleware";
import { Blog } from "./types";

let blogs: Blog[] = [];
let nextBlogId = 1;

export const setupBlogs = (app: Express) => {
  app.use(basicAuthMiddleware);

  app.get("/blogs", (_req: Request, res: Response) => {
    res.status(200).json(blogs.map(b => ({
      ...b,
      id: b.id.toString()
    })));
  });

  app.get("/blogs/:id", (req: Request, res: Response) => {
    const blog = blogs.find(b => b.id === +req.params.id);
    if (!blog) return res.sendStatus(404);
    res.status(200).json({ ...blog, id: blog.id.toString() });
  });

  app.post(
    "/blogs",
    blogValidationRules,
    handleInputErrors,
    (req: Request, res: Response) => {
      const { name, description, websiteUrl } = req.body;
      const newBlog: Blog = {
        id: nextBlogId++,
        name,
        description,
        websiteUrl,
      };
      blogs.push(newBlog);
      res.status(201).json({ ...newBlog, id: newBlog.id.toString() });
    }
  );

  app.put(
    "/blogs/:id",
    blogValidationRules,
    handleInputErrors,
    (req: Request, res: Response) => {
      const blog = blogs.find(b => b.id === +req.params.id);
      if (!blog) return res.sendStatus(404);

      const { name, description, websiteUrl } = req.body;
      blog.name = name;
      blog.description = description;
      blog.websiteUrl = websiteUrl;
      res.sendStatus(204);
    }
  );

  app.delete("/blogs/:id", (req: Request, res: Response) => {
    const index = blogs.findIndex(b => b.id === +req.params.id);
    if (index === -1) return res.sendStatus(404);
    blogs.splice(index, 1);
    res.sendStatus(204);
  });

  app.delete("/ht_02/api/testing/all-data", (_req: Request, res: Response) => {
    blogs = [];
    nextBlogId = 1;
    res.sendStatus(204);
  });
};
