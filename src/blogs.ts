import express, { Express, Request, Response } from "express";
import { basicAuthMiddleware, handleInputErrors , blogValidationRules} from "./middleware";
import { Blog } from "./types";

let blogs: Blog[] = [];
let nextBlogId = 1;

export const setupBlogs = (app: Express) => {
  app.use(express.json());
  app.use(basicAuthMiddleware);

  app.get("/blogs", (_req: Request, res: Response) => {
    res.status(200).json(blogs);
  });

  app.get("/blogs/:id", (req: Request, res: Response) => {
    const id = +req.params.id;
    const blog = blogs.find((b) => b.id === id);
    if (!blog) return res.sendStatus(404);
    res.status(200).json(blog);
  });

  app.post("/blogs",
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
      res.status(201).json(newBlog);
    }
  );

  app.put("/blogs/:id",
    blogValidationRules,
    handleInputErrors,
    (req: Request, res: Response) => {
      const id = +req.params.id;
      const blog = blogs.find((b) => b.id === id);
      if (!blog) return res.sendStatus(404);

      const { name, description, websiteUrl } = req.body;
      blog.name = name;
      blog.description = description;
      blog.websiteUrl = websiteUrl;

      res.sendStatus(204);
    }
  );

  app.delete("/blogs/:id", (req: Request, res: Response) => {
    const id = +req.params.id;
    const index = blogs.findIndex((b) => b.id === id);
    if (index === -1) return res.sendStatus(404);
    blogs.splice(index, 1);
    res.sendStatus(204);
  });

  app.delete("/testing/all-data", (_req: Request, res: Response) => {
    blogs = [];
    nextBlogId = 1;
    res.sendStatus(204);
  });
};