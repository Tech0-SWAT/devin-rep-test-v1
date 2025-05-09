import React from 'react';
import Link from 'next/link';
import { getArticleBySlug } from '../../../data/articles';
import { notFound } from 'next/navigation';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/articles" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to Articles
      </Link>
      
      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="text-gray-600 mb-4">
            <span>Published on {article.date}</span> • <span>By {article.author}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {article.categories.map((category) => (
              <span key={category} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {category}
              </span>
            ))}
          </div>
          {article.featuredImage && (
            <div className="h-64 bg-gray-200 rounded-lg relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                Featured Image Placeholder
              </div>
            </div>
          )}
        </header>
        
        <div className="prose prose-lg max-w-none">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4">{paragraph}</p>
          ))}
        </div>
        
        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
    </div>
  );
}
