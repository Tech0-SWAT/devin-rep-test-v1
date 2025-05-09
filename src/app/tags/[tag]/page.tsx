import React from 'react';
import Link from 'next/link';
import { getArticlesByTag } from '../../../data/articles';
import { notFound } from 'next/navigation';

export default function TagPage({ params }: { params: { tag: string } }) {
  const tag = decodeURIComponent(params.tag);
  const articles = getArticlesByTag(tag);
  
  if (articles.length === 0) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/tags" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to Tags
      </Link>
      
      <h1 className="text-3xl font-bold mb-8">Tag: #{tag}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div key={article.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            {article.featuredImage && (
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Featured Image Placeholder
                </div>
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/articles/${article.slug}`} className="hover:text-blue-600 transition-colors">
                  {article.title}
                </Link>
              </h2>
              <div className="text-sm text-gray-500 mb-2">
                <span>{article.date}</span> • <span>{article.author}</span>
              </div>
              <p className="text-gray-700 mb-4">{article.excerpt}</p>
              <Link 
                href={`/articles/${article.slug}`} 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
