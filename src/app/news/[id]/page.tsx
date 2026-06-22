import { getDocumentById } from "@/lib/actions";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { NewsData } from "../../../types/newsData";
import { MapPinIcon, ArrowLeftIcon, ShareIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import NewsImage from "@/components/common/NewsImage";
import Link from "next/link";

interface DocumentData {
  id: string;
  title: string;
  summary: string;
  downloadURLs: string[]; // Updated to be an array of strings
}

export async function generateMetadata({ params }: any) {
  const documentData = (await getDocumentById(params.id)) as DocumentData;

  if (!documentData) {
    return {
      title: "News not found",
      description: "The news article you're looking for does not exist.",
    };
  }

  return {
    title: documentData.title,
    description: documentData.summary,
    metadataBase: new URL("https://sangliexpressnews.com"),
    openGraph: {
      title: documentData.title,
      description: documentData.summary,
      url: `https://sangliexpressnews.com/news/${params.id}`,
      images: [
        {
          url: documentData.downloadURLs[0] || "/images/logo/logo-dark.png", // Add fallback here
          width: 800,
          height: 600,
          alt: documentData.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: documentData.title,
      description: documentData.summary,
      images: [documentData.downloadURLs[0] || "/images/logo/logo-dark.png"], // Add fallback here
    },
  };
}


export default async function Page({ params }: { params: { id: string } }) {
  const newsData = (await getDocumentById(params.id)) as NewsData;

  if (!newsData) {
    return <div>News not found</div>;
  }

  const formatDate = (dateString: any) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const paragraphs = newsData.summary.split("\n");
  const shareUrl = `https://sangliexpressnews.com/news/${params.id}`;
  const shareText = encodeURIComponent(`Check out this news: ${newsData.title} - ${shareUrl}`);

  return (
    <DefaultLayout>
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="mb-4">
          <Link href="/home" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Back to News
          </Link>
        </div>

        <article className="bg-white dark:bg-boxdark rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 lg:p-8">
            {newsData.category && (
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  {newsData.category}
                </span>
                {newsData.category === "Breaking News" && (
                  <span className="ml-2 inline-block px-3 py-1 text-xs font-semibold text-white bg-red-600 rounded-full animate-pulse">
                    Breaking News
                  </span>
                )}
              </div>
            )}

            <h1 className="text-2xl md:text-4xl font-extrabold leading-tight text-gray-800 dark:text-white mb-3">
              {newsData?.title}
            </h1>

            {newsData?.subtitle && (
              <h2 className="text-lg md:text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4">
                {newsData?.subtitle}
              </h2>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center">
                <MapPinIcon className="h-4 w-4 mr-1 text-rose-600" />
                <span>{newsData?.location || "Sangli"}</span>
              </div>
              <div className="flex items-center">
                <span>{formatDate(newsData.date)}</span>
              </div>
              {newsData?.reporter && (
                <div className="flex items-center">
                  <span>By {newsData.reporter}</span>
                </div>
              )}
            </div>

            {newsData?.downloadURLs && newsData.downloadURLs.length > 0 && (
              <div className="mb-6">
                <div className="carousel w-full rounded-lg overflow-hidden">
                  {newsData.downloadURLs.map((file, index) => (
                    <div
                      key={index}
                      id={`slide-${newsData.id}-${index}`}
                      className="carousel-item relative w-full"
                    >
                      <NewsImage
                        src={file}
                        alt={newsData.title}
                        className="w-full h-64 md:h-96 object-cover"
                        width={800}
                        height={400}
                        priority={index === 0}
                      />
                      {newsData.downloadURLs.length > 1 && (
                        <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
                          <a
                            href={`#slide-${newsData.id}-${index === 0 ? newsData.downloadURLs.length - 1 : index - 1}`}
                            className="btn btn-circle btn-sm bg-white/80 hover:bg-white text-black opacity-0 hover:opacity-100 transition-opacity duration-300"
                          >
                            ❮
                          </a>
                          <a
                            href={`#slide-${newsData.id}-${(index + 1) % newsData.downloadURLs.length}`}
                            className="btn btn-circle btn-sm bg-white/80 hover:bg-white text-black opacity-0 hover:opacity-100 transition-opacity duration-300"
                          >
                            ❯
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {newsData?.photoCaption && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic text-center">
                    {newsData.photoCaption}
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-3 mb-6">
              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share on WhatsApp
              </a>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="mb-4">
                <span className="font-semibold text-gray-800 dark:text-white">
                  {newsData?.reporter && `By ${newsData.reporter}`}
                </span>
              </div>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
                {newsData?.summaryHighlightheading && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">
                      {newsData.summaryHighlightheading}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {newsData.summaryHighlight}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </DefaultLayout>
  );
}
