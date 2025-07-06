import { Express, Request, Response } from "express";
import { postValidationRules, handleInputErrors, basicAuthMiddleware } from "./middleware";
import { Post } from "./types";
import { getBlogById } from "./blogs";

let posts: Post[] = [];
let nextPostId = 1;

export const setupPosts = (app: Express) => {
  // GET all posts (no auth required) - THIS WAS MISSING
  app.get("/posts", (_req: Request, res: Response) => {
    res.status(200).json(posts.map(p => ({
      id: p.id.toString(),
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId.toString(),
      blogName: p.blogName
    })));
  });

  // GET post by id (no auth required)
  app.get("/posts/:id", (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.sendStatus(404);
    
    const post = posts.find(p => p.id === id);
    if (!post) return res.sendStatus(404);
    
    res.status(200).json({
      id: post.id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId.toString(),
      blogName: post.blogName
    });
  });

  // POST post (auth required)
  app.post(
    "/posts",
    basicAuthMiddleware,
    postValidationRules,
    handleInputErrors,
    (req: Request, res: Response) => {
      const { title, shortDescription, content, blogId } = req.body;
      const blog = getBlogById(parseInt(blogId, 10));
      if (!blog) return res.sendStatus(400);

      const newPost: Post = {
        id: nextPostId,
        title,
        shortDescription,
        content,
        blogId: parseInt(blogId, 10),
        blogName: blog.name
      };
      
      posts.push(newPost);
      
      res.status(201).json({
        id: newPost.id.toString(),
        title: newPost.title,
        shortDescription: newPost.shortDescription,
        content: newPost.content,
        blogId: newPost.blogId.toString(),
        blogName: newPost.blogName
      });
      
      nextPostId++;
    }
  );

  // PUT post (auth required)
  app.put(
    "/posts/:id",
    basicAuthMiddleware,
    postValidationRules,
    handleInputErrors,
    (req: Request, res: Response) => {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.sendStatus(404);

      const post = posts.find(p => p.id === id);
      if (!post) return res.sendStatus(404);

      const { title, shortDescription, content, blogId } = req.body;
      const blog = getBlogById(parseInt(blogId, 10));
      if (!blog) return res.sendStatus(400);

      post.title = title;
      post.shortDescription = shortDescription;
      post.content = content;
      post.blogId = parseInt(blogId, 10);
      post.blogName = blog.name;

      res.sendStatus(204);
    }
  );

  // DELETE post (auth required)
  app.delete("/posts/:id", basicAuthMiddleware, (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.sendStatus(404);

    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return res.sendStatus(404);
    
    posts.splice(index, 1);
    res.sendStatus(204);
  });
};

export const clearPosts = () => {
  posts = [];
  nextPostId = 1;
};