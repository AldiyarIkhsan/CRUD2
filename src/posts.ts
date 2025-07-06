import express, { Express, Request, Response } from "express";
import { basicAuthMiddleware, handleInputErrors, postValidationRules } from "./middleware";
import { Post } from "./types";

let posts: Post[] = [];
let nextPostId = 1;

export const setupPosts = (app: Express) => {
  app.use(express.json());
  app.use(basicAuthMiddleware);

  app.get("/posts", (_req, res) => {
    res.status(200).json(posts);
  });

  app.get("/posts/:id", (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.sendStatus(404);

    const post = posts.find((post) => post.id === id);
    if (!post) return res.sendStatus(404);
    res.status(200).json(post);
  });

  app.post("/posts", postValidationRules, handleInputErrors, (req: Request, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body;
    const newPost: Post = {
      id: nextPostId++,
      title,
      shortDescription,
      content,
      blogId,
      blogName: "Sample Blog Name",
    };
    posts.push(newPost);
    res.status(201).json(newPost);
  });

  app.put("/posts/:id", postValidationRules, handleInputErrors, (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.sendStatus(404);

    const post = posts.find((p) => p.id === id);
    if (!post) return res.sendStatus(404);

    const { title, shortDescription, content, blogId } = req.body;
    Object.assign(post, {
      title,
      shortDescription,
      content,
      blogId,
      blogName: "Sample Blog Name",
    });

    res.sendStatus(204);
  });

  app.delete("/posts/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.sendStatus(404);

    const index = posts.findIndex((v) => v.id === id);
    if (index === -1) return res.sendStatus(404);
    posts.splice(index, 1);
    res.sendStatus(204);
  });
};
