'use client';
import { useState, useEffect } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Link from "next/link";
import Image from "next/image";
import { getAllDocuments, deleteDocument } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useFetchUserInfo";
import { Button } from "@nextui-org/button";
export interface NewsData {
  id: string;
  files: string[];
  title: string;
  newsId: string;
  summary: string;
  date: string;
  downloadURLs: string[];
}

const Home: React.FC = () => {
  const [documents, setDocuments] = useState<NewsData[]>([]);
  const router = useRouter();
  const { userInfo } = useUser() ?? {};

  const fetchDocuments = async () => {
    try {
      const fetchedDocuments = await getAllDocuments();
      if (fetchedDocuments) {
        setDocuments(fetchedDocuments as NewsData[]);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

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
      <div className="px-2 py-4">
        <div className="mb-4">
          {userInfo?.role === "admin" && (
            <button className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600">
              <Link href="/create">Create News</Link>
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
          {documents.map((doc) => (
            <div key={doc.id} className="card rounded-md bg-base-100 shadow-xl">
              <figure className="w-full">
                <div className="carousel w-full">
                  {doc?.downloadURLs?.map((file, index) => (
                    <div
                      key={index}
                      id={`slide-${doc.id}-${index}`}
                      className="carousel-item relative w-full"
                    >
                      <Image
                        src={file}
                        alt={doc.title}
                        className="w-full object-cover"
                        width={300}
                        height={200}
                      />
                      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a
                          href={`#slide-${doc.id}-${index === 0 ? doc.downloadURLs.length - 1 : index - 1}`}
                          className="btn btn-circle opacity-0 hover:opacity-100 transition-opacity duration-300"
                        >
                          ❮
                        </a>
                        <a
                          href={`#slide-${doc.id}-${(index + 1) % doc.files.length}`}
                          className="btn btn-circle opacity-0 hover:opacity-100 transition-opacity duration-300"
                        >
                          ❯
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title">{doc.title}</h2>
                <p>
                  {doc.summary.length > 100
                    ? `${doc.summary.substring(0, 100)}...`
                    : doc.summary}
                </p>
                <p className="text-gray-500 text-sm">{doc.date}</p>
                <div className="card-actions justify-end">
                  <Link href={`/news/${doc.id}`}>
                    <Button className="rounded-md bg-blue-600 text-white">
                      Read More
                    </Button>
                  </Link>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Check out this news: ${doc.title} https://sangliexpressnews.com/news/${doc.id}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button color="success" className="rounded-md text-white">
                      Share on WhatsApp
                    </Button>
                  </a>
                  {userInfo?.role === "admin" && (
                    <Button
                      color="danger"
                      className="rounded-md text-white"
                      onClick={() => {
                        handleDelete(doc.id);
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
      </div>
    </DefaultLayout>
  );
};

export default Home;
