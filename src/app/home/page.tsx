'use client';
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import Image from "next/image";
import { getAllDocuments, deleteDocument } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useFetchUserInfo";
import { Button } from "@nextui-org/button";
import NewsImage from "@/components/common/NewsImage";
import NewsCardSkeleton from "@/components/common/NewsCardSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import { NewsData } from "@/types/newsData";

const Home: React.FC = () => {
  const [documents, setDocuments] = useState<NewsData[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<NewsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const router = useRouter();
  const { userInfo } = useUser() ?? {};

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const fetchedDocuments = await getAllDocuments();
      if (fetchedDocuments) {
        // Sort by date (latest first)
        const sortedDocs = (fetchedDocuments as NewsData[]).sort((a, b) => {
          const dateA = new Date(a.date.split('/').reverse().join('-'));
          const dateB = new Date(b.date.split('/').reverse().join('-'));
          return dateB.getTime() - dateA.getTime();
        });
        setDocuments(sortedDocs);
        setFilteredDocuments(sortedDocs);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    let filtered = [...documents];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.title?.toLowerCase().includes(query) ||
          doc.subtitle?.toLowerCase().includes(query) ||
          doc.summary?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter((doc) => doc.category === selectedCategory);
    }

    // Apply sorting
    if (sortBy === "latest") {
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateB.getTime() - dateA.getTime();
      });
    } else if (sortBy === "oldest") {
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.date.split('/').reverse().join('-'));
        const dateB = new Date(b.date.split('/').reverse().join('-'));
        return dateA.getTime() - dateB.getTime();
      });
    }

    setFilteredDocuments(filtered);
  }, [searchQuery, selectedCategory, sortBy, documents]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      await fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <DefaultLayout>
      <div className="px-2 py-4 md:px-4 md:py-6">
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Latest News
          </h1>
          {userInfo?.role === "admin" && (
            <Link href="/create">
              <Button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                Create News
              </Button>
            </Link>
          )}
        </div>

        <div className="mb-6 p-4 bg-white dark:bg-boxdark rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-boxdark-2 dark:text-white text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-boxdark-2 dark:text-white text-gray-900 dark:text-gray-100"
              >
                <option value="">All Categories</option>
                <option value="Politics">Politics</option>
                <option value="Local News">Local News</option>
                <option value="Crime">Crime</option>
                <option value="Agriculture">Agriculture</option>
                <option value="Sports">Sports</option>
                <option value="Education">Education</option>
                <option value="Business">Business</option>
                <option value="Breaking News">Breaking News</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-boxdark-2 dark:text-white text-gray-900 dark:text-gray-100"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredDocuments.length === 0 ? (
          <EmptyState message={documents.length === 0 ? "No news articles available at the moment." : "No news found matching your search criteria."} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white dark:bg-boxdark rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  {doc?.downloadURLs && doc.downloadURLs.length > 0 ? (
                    <div className="carousel w-full">
                      {doc.downloadURLs.map((file, index) => (
                        <div
                          key={index}
                          id={`slide-${doc.id}-${index}`}
                          className="carousel-item relative w-full"
                        >
                          <NewsImage
                            src={file}
                            alt={doc.title}
                            className="w-full h-48 object-cover"
                            width={400}
                            height={200}
                          />
                          {doc.downloadURLs.length > 1 && (
                            <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
                              <a
                                href={`#slide-${doc.id}-${index === 0 ? doc.downloadURLs.length - 1 : index - 1}`}
                                className="btn btn-circle btn-sm bg-white/80 hover:bg-white text-black opacity-0 hover:opacity-100 transition-opacity duration-300"
                              >
                                ❮
                              </a>
                              <a
                                href={`#slide-${doc.id}-${(index + 1) % doc.downloadURLs.length}`}
                                className="btn btn-circle btn-sm bg-white/80 hover:bg-white text-black opacity-0 hover:opacity-100 transition-opacity duration-300"
                              >
                                ❯
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <NewspaperIcon className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  {doc.category === "Breaking News" && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      Breaking News
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {doc.category && (
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded mb-2">
                      {doc.category}
                    </span>
                  )}
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                    {doc.title}
                  </h2>
                  {doc.subtitle && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                      {doc.subtitle}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                    {doc.summary.length > 150
                      ? `${doc.summary.substring(0, 150)}...`
                      : doc.summary}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>{doc.date}</span>
                    {doc.reporter && <span>By {doc.reporter}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/news/${doc.id}`} className="flex-1">
                      <Button className="w-full rounded-lg bg-blue-600 text-white text-sm">
                        Read More
                      </Button>
                    </Link>
                    {userInfo?.role === "admin" && (
                      <Button
                        color="danger"
                        size="sm"
                        className="rounded-lg text-white"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this news?")) {
                            handleDelete(doc.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Home;
