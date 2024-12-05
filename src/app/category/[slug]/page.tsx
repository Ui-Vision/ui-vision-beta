'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface FilterTag {
  id: string;
  name: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  filterTags: FilterTag[];
  userId: string;
}

interface Category {
  id: string;
  name: string;
  subTitle: string;
  products: Product[];
}

interface User {
  image: string | null;
  username: string;
}

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const [slug, setSlug] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilterTag, setSelectedFilterTag] = useState<FilterTag | null>(null);
  const [userData, setUserData] = useState<Record<string, User>>({});

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params;
        setSlug(resolvedParams.slug);
      } catch (err) {
        setError('Failed to retrieve parameters.');
        setLoading(false);
      }
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!slug) return;
      try {
        const response = await fetch(`/api/categories/${slug}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch category with slug: ${slug}`);
        }
        const data = await response.json();
        setCategory(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  const getUniqueFilterTags = () => {
    if (!category) return [];
    const tags = category.products.flatMap((product) => product.filterTags);
    const uniqueTags = Array.from(
      new Map(tags.map((tag) => [`${tag.name}:${tag.value}`, tag])).values()
    );
    return uniqueTags;
  };

  const filterProductsByTag = () => {
    if (!category) return [];
    if (!selectedFilterTag) return category.products;
    return category.products.filter((product) =>
      product.filterTags.some(
        (tag) =>
          tag.name === selectedFilterTag.name &&
          tag.value === selectedFilterTag.value
      )
    );
  };

  useEffect(() => {
    if (category) {
      const fetchUserData = async () => {
        const users: Record<string, User> = {};
        for (const product of category.products) {
          if (product.userId && !users[product.userId]) {
            const userResponse = await fetch(`/api/user/${product.userId}`);
            if (userResponse.ok) {
              const userData = await userResponse.json();
              users[product.userId] = { image: userData.image, username: userData.username };
            }
          }
        }
        setUserData(users);
      };
      fetchUserData();
    }
  }, [category]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  const uniqueFilterTags = getUniqueFilterTags();
  const filteredProducts = filterProductsByTag();

  return (
    <div>
      <h1 className="text-2xl font-bold">{category.name}</h1>
      <p className="text-gray-600">{category.subTitle}</p>

      <div className="my-4 flex flex-wrap gap-3">
        <button
          onClick={() => setSelectedFilterTag(null)}
          className={`px-3 py-1 border rounded ${
            !selectedFilterTag
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          All Products
        </button>

        {uniqueFilterTags.map((tag) => (
          <button
            key={`${tag.name}:${tag.value}`}
            onClick={() =>
              setSelectedFilterTag(
                selectedFilterTag?.id === tag.id ? null : tag
              )
            }
            className={`px-3 py-1 border rounded ${
              selectedFilterTag?.id === tag.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {tag.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const user = userData[product.userId];
            return (
              <div
                key={product.id}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <h2 className="text-lg font-medium">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.description}</p>
                <p className="text-blue-600 font-semibold">${product.price}</p>

                {user && (
                  <div className="flex items-center mt-4">
                    {user.image && (
                      <Image
                        src={user.image}
                        alt={user.username || 'User profile'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <span className="ml-2 text-sm font-medium">{user.username}</span>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No products match the selected filter.</p>
        )}
      </div>
    </div>
  );
}