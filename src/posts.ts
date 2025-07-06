import { Express, Request, Response } from "express";
import { postValidationRules, handleInputErrors, basicAuthMiddleware } from "./middleware";
import { Post } from "./types";
import { getBlogById } from "./blogs";

let posts: Post[] = [];
let nextPostId = 1;

export const setupPosts = (app: Express) => {
  // GET all posts (no auth required)
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

  // POST post (auth required)
  app.post(
    "/posts",
    basicAuthMiddleware,
    postValidationRules,
    handleInputErrors,
    (req: Request, res: Response) => {
      const { title, shortDescription, content, blogId } = req.body;
      const blog = getBlogById(+blogId);
      if (!blog) return res.sendStatus(400);

      const newPost: Post = {
        id: nextPostId++,
        title,
        shortDescription,
        content,
        blogId: +blogId,
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
    }
  );

  // PUT post (auth required)
  app.put(
    "/posts/:id",
    basicAuthMiddleware,
    postValidationRules,
    handleInputErrors,
    (req: Request, res: Response) => {
      const post = posts.find(p => p.id === +req.params.id);
      if (!post) return res.sendStatus(404);

      const { title, shortDescription, content, blogId } = req.body;
      const blog = getBlogById(+blogId);
      if (!blog) return res.sendStatus(400);

      post.title = title;
      post.shortDescription = shortDescription;
      post.content = content;
      post.blogId = +blogId;
      post.blogName = blog.name;

      res.sendStatus(204);
    }
  );

  // DELETE post (auth required)
  app.delete("/posts/:id", basicAuthMiddleware, (req: Request, res: Response) => {
    const index = posts.findIndex(p => p.id === +req.params.id);
    if (index === -1) return res.sendStatus(404);
    posts.splice(index, 1);
    res.sendStatus(204);
  });
};

export const clearPosts = () => {
  posts = [];
  nextPostId = 1;
};