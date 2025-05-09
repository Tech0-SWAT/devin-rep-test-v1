import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { withAuth } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: true,
        tags: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(async (req: NextRequest) => {
  try {
    const user = (req as any).user;
    const { title, content, excerpt, slug, featuredImage, categories, tags } = await req.json();

    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: 'Title, content, and slug are required' },
        { status: 400 }
      );
    }

    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Article with this slug already exists' },
        { status: 409 }
      );
    }

    const author = await prisma.user.findUnique({
      where: { email: user.sub },
    });

    if (!author) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const categoryConnections = await Promise.all(
      categories.map(async (categoryName: string) => {
        const category = await prisma.category.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName },
        });
        return { id: category.id };
      })
    );

    const tagConnections = await Promise.all(
      tags.map(async (tagName: string) => {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        });
        return { id: tag.id };
      })
    );

    const article = await prisma.article.create({
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        slug,
        featuredImage,
        authorId: author.id,
        categories: {
          connect: categoryConnections,
        },
        tags: {
          connect: tagConnections,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: true,
        tags: true,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
});
