import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              Next.js Blog
            </Link>
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/tags" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Tags
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
