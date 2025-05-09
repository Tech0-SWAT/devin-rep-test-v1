'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');

    if (!storedUser || !token) {
      router.push('/admin/login');
      return;
    }

    setUser(JSON.parse(storedUser));

    fetchArticles(token);
  }, [router]);

  const fetchArticles = async (token: string) => {
    try {
      const response = await fetch('/api/articles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch articles');
      }

      const data = await response.json();
      setArticles(data.articles);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const handleDeleteArticle = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    try {
      const response = await fetch(`/api/articles/${slug}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      setArticles(articles.filter(article => article.slug !== slug));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-gray-600">
                Welcome, {user.name || user.email}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="text-blue-600 hover:text-blue-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
            <Link
              href="/admin/articles/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              New Article
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {articles.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">
                  No articles found. Create your first article!
                </li>
              ) : (
                articles.map((article) => (
                  <li key={article.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {article.title}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>
                            {new Date(article.date).toLocaleDateString()}
                          </span>
                          <span className="mx-2">•</span>
                          <span>
                            {article.categories.map((c) => c.name).join(', ')}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <Link
                          href={`/admin/articles/edit/${article.slug}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteArticle(article.slug)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
