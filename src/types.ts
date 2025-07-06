export interface Blog {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
}

export interface Post {
  id: number;
  title: string;
  shortDescription: string;
  content: string;
  blogId: number;
  blogName: string;
}