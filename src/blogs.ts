import { Express, Request, Response } from "express";
import { blogValidationRules, handleInputErrors, basicAuthMiddleware } from "./middleware";
import { Blog } from "./types";

let blogs: Blog[] = [];
let nextBlogId = 1;

export const setupBlogs = (app: Express) => {
  // GET all blogs (no auth required)
  app.get("/blogs", (_req: Request, res: Response) => {
    res.status(200).json(blogs.map(b => ({
      id: b.id.toString(),
      name: b.name,
      description: b.description,
      websiteUrl: b.websiteUrl
    })));
  });

  // GET blog by id (no auth required)
  app.get("/blogs/:id", (req: Request, res: Response) => {
    const blog = blogs.find(b => b.id === +req.params.id);
    if (!blog) return res.sendStatus(404);
    res.status(200).json({
      id: blog.id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl
    });
  });

  // POST blog (auth required)
  app.post(
    "/blogs",
    basicAuthMiddleware,
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
      res.status(201).json({
        id: newBlog.id.toString(),
        name: newBlog.name,
        description: newBlog.description,
        websiteUrl: newBlog.websiteUrl
      });
    }
  );

  // PUT blog (auth required)
  app.put(
    "/blogs/:id",
    basicAuthMiddleware,
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

  // DELETE blog (auth required)
  app.delete("/blogs/:id", basicAuthMiddleware, (req: Request, res: Response) => {
    const index = blogs.findIndex(b => b.id === +req.params.id);
    if (index === -1) return res.sendStatus(404);
    blogs.splice(index, 1);
    res.sendStatus(204);
  });
};

export const getBlogs = () => blogs;
export const getBlogById = (id: number) => blogs.find(b => b.id === id);
export const clearBlogs = () => {
  blogs = [];
  nextBlogId = 1;
};