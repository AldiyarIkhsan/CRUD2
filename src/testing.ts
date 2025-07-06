import { Express, Request, Response } from "express";
import { clearBlogs } from "./blogs";
import { clearPosts } from "./posts";

export const setupTesting = (app: Express) => {
  app.delete("/testing/all-data", (_req: Request, res: Response) => {
    clearBlogs();
    clearPosts();
    res.sendStatus(204);
  });
};