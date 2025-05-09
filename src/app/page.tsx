import React from 'react';
import Link from 'next/link';
import { articles } from '../data/articles';

export default function Home() {
  const allCategories = Array.from(
    new Set(articles.flatMap(article => article.categories))
  );

  const latestArticles = [...articles]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-6">Welcome to Our Blog</h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Discover the latest articles on web development, programming, and technology.
        </p>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Latest Articles</h2>
          <Link href="/articles" className="text-blue-600 hover:text-blue-800">
            View all articles →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article) => (
            <div key={article.id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              {article.featuredImage && (
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    Featured Image Placeholder
                  </div>
                </div>
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  <Link href={`/articles/${article.slug}`} className="hover:text-blue-600 transition-colors">
                    {article.title}
                  </Link>
                </h3>
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
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Link href="/categories" className="text-blue-600 hover:text-blue-800">
            View all categories →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allCategories.map((category) => (
            <Link 
              key={category} 
              href={`/categories/${encodeURIComponent(category)}`}
              className="bg-gray-100 hover:bg-gray-200 transition-colors p-4 rounded-lg text-center"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
