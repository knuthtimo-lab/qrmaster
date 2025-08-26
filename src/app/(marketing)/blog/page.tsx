'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const blogPosts = [
  {
    slug: 'qr-codes-im-restaurant',
    title: 'QR-Codes im Restaurant: Die digitale Revolution der Speisekarte',
    excerpt: 'Erfahren Sie, wie QR-Codes die Gastronomie revolutionieren und welche Vorteile sie für Restaurants und Gäste bieten.',
    date: '2024-01-15',
    readTime: '5 Min',
    category: 'Gastronomie',
    image: '🍽️',
  },
  {
    slug: 'dynamische-vs-statische-qr-codes',
    title: 'Dynamische vs. Statische QR-Codes: Was ist der Unterschied?',
    excerpt: 'Ein umfassender Vergleich zwischen dynamischen und statischen QR-Codes und wann Sie welchen Typ verwenden sollten.',
    date: '2024-01-10',
    readTime: '3 Min',
    category: 'Grundlagen',
    image: '📊',
  },
  {
    slug: 'qr-code-marketing-strategien',
    title: 'QR-Code Marketing-Strategien für 2024',
    excerpt: 'Die besten Marketing-Strategien mit QR-Codes für Ihr Unternehmen im Jahr 2024.',
    date: '2024-01-05',
    readTime: '7 Min',
    category: 'Marketing',
    image: '📈',
  },
];

export default function BlogPage() {
  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Blog & Resources
          </h1>
          <p className="text-xl text-gray-600">
            Learn about QR codes, best practices, and industry insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card hover className="h-full">
                <CardHeader>
                  <div className="text-4xl mb-4 text-center bg-gray-100 rounded-lg py-8">
                    {post.image}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="info">{post.category}</Badge>
                    <span className="text-sm text-gray-500">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <p className="text-sm text-gray-500">{post.date}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}