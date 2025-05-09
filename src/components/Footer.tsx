import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-600">
              A simple WordPress-like blog built with Next.js and TypeScript, showcasing modern web development techniques.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
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
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <p className="text-gray-600 mb-2">
              Follow us on social media for the latest updates.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                GitHub
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Next.js Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
