import React from 'react';
import Link from 'next/link';
import { articles } from '../../data/articles';

export default function CategoriesPage() {
  const categoriesWithCount = articles.reduce((acc, article) => {
    article.categories.forEach(category => {
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
    });
    return acc;
  }, {} as Record<string, number>);

  const categoriesArray = Object.entries(categoriesWithCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesArray.map(({ name, count }) => (
          <Link 
            key={name} 
            href={`/categories/${encodeURIComponent(name)}`}
            className="bg-white border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{name}</h2>
            <p className="text-gray-600">{count} article{count !== 1 ? 's' : ''}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
