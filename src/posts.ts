import { Express, Request, Response } from "express";
import { postValidationRules, handleInputErrors, basicAuthMiddleware } from "./middleware";
import { Post } from "./types";

let posts: Post[] = [];
let nextPostId = 1;

export const setupPosts = (app: Express) => {
  app.use(basicAuthMiddleware);

  app.get("/posts", (_req: Request, res: Response) => {
    res.status(200).json(posts.map(p => ({
      ...p,
      id: p.id.toString(),
      blogId: p.blogId.toString()
    })));
  });

  app.get("/posts/:id", (req: Request, res: Response) => {
    const post = posts.find(p => p.id === +req.params.id);
    if (!post) return res.sendStatus(404);
    res.status(200).json({
      ...post,
      id: post.id.toString(),
      blogId: post.blogId.toString()
    });
  });

  app.post(
    "/posts",
    postValidationRules,
    handleInputErrors,
    (req: Request, res: Response) => {
      const { title, shortDescription, content, blogId } = req.body;

      const newPost: Post = {
        id: nextPostId++,
        title,
        shortDescription,
        content,
        blogId: +blogId,
        blogName: "Sample Blog Name",
      };

      posts.push(newPost);
      res.status(201).json({
        ...newPost,
        id: newPost.id.toString(),
        blogId: newPost.blogId.toString()
      });
    }
  );

  app.put(
    "/posts/:id",
    postValidationRules,
    handleInputErrors,
    (req: Request, res: Response) => {
      const post = posts.find(p => p.id === +req.params.id);
      if (!post) return res.sendStatus(404);

      const { title, shortDescription, content, blogId } = req.body;
      post.title = title;
      post.shortDescription = shortDescription;
      post.content = content;
      post.blogId = +blogId;
      post.blogName = "Sample Blog Name";

      res.sendStatus(204);
    }
  );

  app.delete("/posts/:id", (req: Request, res: Response) => {
    const index = posts.findIndex(p => p.id === +req.params.id);
    if (index === -1) return res.sendStatus(404);
    posts.splice(index, 1);
    res.sendStatus(204);
  });
};
