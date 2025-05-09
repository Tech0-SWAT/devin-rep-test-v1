import { Article } from '../types';

export const articles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js',
    content: 'Next.js is a React framework that enables server-side rendering and static site generation. It provides a great developer experience with features like file-system routing, API routes, and built-in CSS support.',
    excerpt: 'Learn how to set up a Next.js project and create your first page with this comprehensive guide.',
    author: 'John Doe',
    date: '2025-05-01',
    slug: 'getting-started-with-nextjs',
    featuredImage: '/images/nextjs.jpg',
    categories: ['Web Development', 'React'],
    tags: ['Next.js', 'React', 'JavaScript']
  },
  {
    id: '2',
    title: 'Understanding TypeScript in React Applications',
    content: 'TypeScript is a statically typed superset of JavaScript that adds type safety to your code. When used with React, it can help catch errors during development and provide better tooling support.',
    excerpt: 'Discover how TypeScript can enhance your React applications with static type checking and improved tooling.',
    author: 'Jane Smith',
    date: '2025-05-02',
    slug: 'understanding-typescript-in-react',
    featuredImage: '/images/typescript.jpg',
    categories: ['Web Development', 'TypeScript'],
    tags: ['TypeScript', 'React', 'JavaScript']
  },
  {
    id: '3',
    title: 'Building a Blog with Next.js and Markdown',
    content: 'Markdown is a lightweight markup language that\'s easy to write and read. When combined with Next.js, it can be a powerful tool for creating a blog.',
    excerpt: 'Learn how to create a blog using Next.js and Markdown with this step-by-step guide.',
    author: 'Bob Johnson',
    date: '2025-05-03',
    slug: 'building-blog-nextjs-markdown',
    featuredImage: '/images/markdown.jpg',
    categories: ['Web Development', 'Next.js'],
    tags: ['Next.js', 'Markdown', 'Blog']
  },
  {
    id: '4',
    title: 'CSS-in-JS with Styled Components',
    content: 'Styled Components is a library that allows you to write CSS in your JavaScript code. It\'s a popular choice for styling React components because it provides a way to scope styles to specific components.',
    excerpt: 'Explore how to use Styled Components to write CSS in your JavaScript code and create dynamic, scoped styles.',
    author: 'Alice Williams',
    date: '2025-05-04',
    slug: 'css-in-js-styled-components',
    featuredImage: '/images/styled-components.jpg',
    categories: ['Web Development', 'CSS'],
    tags: ['CSS-in-JS', 'Styled Components', 'React']
  },
  {
    id: '5',
    title: 'State Management with Redux',
    content: 'Redux is a predictable state container for JavaScript applications. It helps you write applications that behave consistently, run in different environments, and are easy to test.',
    excerpt: 'Learn how to manage state in your React applications using Redux, a predictable state container for JavaScript apps.',
    author: 'Charlie Brown',
    date: '2025-05-05',
    slug: 'state-management-redux',
    featuredImage: '/images/redux.jpg',
    categories: ['Web Development', 'State Management'],
    tags: ['Redux', 'React', 'State Management']
  }
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(article => article.slug === slug);
}

export function getArticleById(id: string): Article | undefined {
  return articles.find(article => article.id === id);
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter(article => article.categories.includes(category));
}

export function getArticlesByTag(tag: string): Article[] {
  return articles.filter(article => article.tags.includes(tag));
}
