import { PrismaClient } from '../src/generated/prisma';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });

  console.log('Created admin user:', admin.email);

  const webDev = await prisma.category.upsert({
    where: { name: 'Web Development' },
    update: {},
    create: { name: 'Web Development' },
  });

  const react = await prisma.category.upsert({
    where: { name: 'React' },
    update: {},
    create: { name: 'React' },
  });

  const nextjs = await prisma.category.upsert({
    where: { name: 'Next.js' },
    update: {},
    create: { name: 'Next.js' },
  });

  const jsTag = await prisma.tag.upsert({
    where: { name: 'JavaScript' },
    update: {},
    create: { name: 'JavaScript' },
  });

  const reactTag = await prisma.tag.upsert({
    where: { name: 'React' },
    update: {},
    create: { name: 'React' },
  });

  const nextjsTag = await prisma.tag.upsert({
    where: { name: 'Next.js' },
    update: {},
    create: { name: 'Next.js' },
  });

  const typescriptTag = await prisma.tag.upsert({
    where: { name: 'TypeScript' },
    update: {},
    create: { name: 'TypeScript' },
  });

  const article1 = await prisma.article.upsert({
    where: { slug: 'getting-started-with-nextjs' },
    update: {},
    create: {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      content: `
# Getting Started with Next.js

Next.js is a React framework that enables server-side rendering and static site generation for React applications.

## Installation

To create a new Next.js app, run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Key Features

- **Server-Side Rendering (SSR)**: Pre-renders pages on each request
- **Static Site Generation (SSG)**: Pre-renders pages at build time
- **API Routes**: Create API endpoints as Node.js serverless functions
- **File-based Routing**: Create routes based on the file system
- **Built-in CSS Support**: Import CSS files directly in your components
- **Fast Refresh**: See changes instantly without losing component state

## Basic Routing

Next.js has a file-system based router built on the concept of pages. When a file is added to the \`pages\` directory, it's automatically available as a route.

For example:
- \`pages/index.js\` → \`/\`
- \`pages/about.js\` → \`/about\`
- \`pages/blog/[slug].js\` → \`/blog/:slug\`

## Data Fetching

Next.js provides several ways to fetch data:

1. **getStaticProps**: Fetch data at build time
2. **getStaticPaths**: Specify dynamic routes to pre-render
3. **getServerSideProps**: Fetch data on each request

## Conclusion

Next.js simplifies the development of React applications by providing built-in features for routing, data fetching, and rendering. It's a great choice for building modern web applications.
      `,
      excerpt: 'Learn how to get started with Next.js, a React framework for production-grade applications with server-side rendering and static site generation.',
      authorId: admin.id,
      categories: {
        connect: [
          { id: webDev.id },
          { id: react.id },
          { id: nextjs.id },
        ],
      },
      tags: {
        connect: [
          { id: jsTag.id },
          { id: reactTag.id },
          { id: nextjsTag.id },
        ],
      },
    },
  });

  const article2 = await prisma.article.upsert({
    where: { slug: 'typescript-with-react-and-nextjs' },
    update: {},
    create: {
      title: 'TypeScript with React and Next.js',
      slug: 'typescript-with-react-and-nextjs',
      content: `
# TypeScript with React and Next.js

TypeScript adds static typing to JavaScript, making your code more robust and maintainable. When combined with React and Next.js, it provides an excellent developer experience.

## Setting Up TypeScript in Next.js

Next.js has built-in TypeScript support. To create a new TypeScript project:

\`\`\`bash
npx create-next-app@latest --typescript my-app
cd my-app
npm run dev
\`\`\`

## Type Definitions for React Components

Here's how to define types for React components:

\`\`\`tsx
interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const Card: React.FC<Props> = ({ title, description, children }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <div className="content">{children}</div>
    </div>
  );
};
\`\`\`

## Type Definitions for API Routes

For API routes in Next.js:

\`\`\`tsx
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: 'John Doe' });
}
\`\`\`

## Type Definitions for Data Fetching

For data fetching functions:

\`\`\`tsx
import { GetStaticProps, GetStaticPaths, GetServerSideProps } from 'next';

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {
      data: {},
    },
  };
};
\`\`\`

## Benefits of TypeScript

1. **Catch Errors Early**: TypeScript catches type errors during development
2. **Better IDE Support**: Enhanced autocomplete and documentation
3. **Safer Refactoring**: TypeScript helps ensure refactoring doesn't break existing code
4. **Self-Documenting Code**: Types serve as documentation for your code

## Conclusion

TypeScript enhances the development experience with React and Next.js by providing type safety and better tooling. It helps catch errors early and makes your code more maintainable.
      `,
      excerpt: 'Learn how to use TypeScript with React and Next.js to build type-safe applications with better developer experience and fewer runtime errors.',
      authorId: admin.id,
      categories: {
        connect: [
          { id: webDev.id },
          { id: react.id },
          { id: nextjs.id },
        ],
      },
      tags: {
        connect: [
          { id: typescriptTag.id },
          { id: reactTag.id },
          { id: nextjsTag.id },
        ],
      },
    },
  });

  console.log('Created sample articles:', [article1.title, article2.title]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
