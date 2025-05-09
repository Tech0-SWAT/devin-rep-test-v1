import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { withAuth } from '../../../../lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const article = await prisma.article.findUnique({
      where: { slug },
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

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}

export const PUT = withAuth(async (
  req: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    const user = (req as any).user;
    const { slug } = params;
    const { title, content, excerpt, newSlug, featuredImage, categories, tags } = await req.json();

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
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

    if (article.authorId !== author.id && author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    if (newSlug && newSlug !== slug) {
      const existingArticle = await prisma.article.findUnique({
        where: { slug: newSlug },
      });

      if (existingArticle) {
        return NextResponse.json(
          { error: 'Article with this slug already exists' },
          { status: 409 }
        );
      }
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

    const updatedArticle = await prisma.article.update({
      where: { slug },
      data: {
        title,
        content,
        excerpt: excerpt || content.substring(0, 150) + '...',
        slug: newSlug || slug,
        featuredImage,
        categories: {
          set: [],
          connect: categoryConnections,
        },
        tags: {
          set: [],
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

    return NextResponse.json({ article: updatedArticle });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
});

export const DELETE = withAuth(async (
  req: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    const user = (req as any).user;
    const { slug } = params;

    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        author: true,
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
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

    if (article.authorId !== author.id && author.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.article.delete({
      where: { slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
});
