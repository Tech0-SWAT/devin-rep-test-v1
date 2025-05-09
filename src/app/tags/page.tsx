import React from 'react';
import Link from 'next/link';
import { articles } from '../../data/articles';

export default function TagsPage() {
  const tagsWithCount = articles.reduce((acc, article) => {
    article.tags.forEach(tag => {
      if (!acc[tag]) {
        acc[tag] = 0;
      }
      acc[tag]++;
    });
    return acc;
  }, {} as Record<string, number>);

  const tagsArray = Object.entries(tagsWithCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tags</h1>
      <div className="flex flex-wrap gap-4">
        {tagsArray.map(({ name, count }) => (
          <Link 
            key={name} 
            href={`/tags/${encodeURIComponent(name)}`}
            className="bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-2 rounded-full text-center"
          >
            <span className="font-medium">{name}</span>
            <span className="text-gray-600 ml-2">({count})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
