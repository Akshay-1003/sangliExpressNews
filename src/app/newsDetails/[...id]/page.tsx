"use client";
import React, { useState, useEffect } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";
import { getDocumentById } from "@/lib/actions"; 
import { MapPinIcon } from "@heroicons/react/24/solid";
import Head from "next/head"; // Import Head for meta tags

interface NewsData {
  id: string;
  files: string[];
  title: string;
  newsId: string;
  summary: string;
  date: string;
  downloadURLs: string[];
  reporter: string;
  photoCaption: string;
  summaryHighlightheadinq: string;
  summaryHighlight: string;
  subtitle: string;
}

const NewsDetail: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  
  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (id) {
        try {
          const fetchedDocument = await getDocumentById(
            "news",
            id[0] as string,
          ); // Fetch the document using the ID
          if (fetchedDocument) {
            setNewsData(fetchedDocument as NewsData);
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (!newsData) {
    return (
      <DefaultLayout>
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </DefaultLayout>
    );
  }

  const formatDate = (dateString: any) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`); // Convert to yyyy-mm-dd format
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const paragraphs = newsData.summary.split("\n");

  return (
    <DefaultLayout>
      {/* Add meta tags inside the Head component */}
      <Head>
        <title>{newsData.title}</title>
        <meta name="description" content={newsData.subtitle} />
        
        {/* Open Graph meta tags for social sharing */}
        <meta property="og:title" content={newsData.title} />
        <meta property="og:description" content={newsData.subtitle} />
        <meta property="og:image" content={newsData.downloadURLs[0]} />
        <meta property="og:url" content={`https://www.sangliexpressnews.com/newsDetails/${newsData.id}`} />
        <meta property="og:type" content="article" />

        {/* Twitter card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={newsData.title} />
        <meta name="twitter:description" content={newsData.subtitle} />
        <meta name="twitter:image" content={newsData.downloadURLs[0]} />
      </Head>

      {/* News content */}
      <div className="container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="mb-4">
          <h1 className="text-slate-700 text-4xl font-extrabold leading-tight">{newsData?.title}</h1>
        </div>
        <div className="text-gray-900 text-3xl font-extrabold leading-tight mb-4">
          <h2>{newsData?.subtitle}</h2>
        </div>

        {/* Image Carousel */}
        <div className="carousel mb-2 w-full">
          {newsData?.downloadURLs?.map((file, index) => (
            <div
              key={index}
              id={`slide-${newsData.id}-${index}`}
              className="carousel-item relative w-full"
            >
              <Image
                src={file}
                alt={newsData.title}
                className="w-full rounded-lg object-cover"
                width={800}
                height={400}
              />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a
                  href={`#slide-${newsData.id}-${index === 0 ? newsData.files.length - 1 : index - 1}`}
                  className="btn btn-circle"
                >
                  ❮
                </a>
                <a
                  href={`#slide-${newsData.id}-${(index + 1) % newsData.files.length}`}
                  className="btn btn-circle"
                >
                  ❯
                </a>
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="mb-4 inline-flex items-center text-lg font-semibold ml-2 ">
            {newsData?.photoCaption}
          </p>
        </div>

        {/* Author and Date */}
        <p className="mb-4 inline-flex items-center text-lg font-semibold text-blue-700">
          <MapPinIcon className="mr-2 h-5 w-5 text-rose-600" />
          {`Sangli Express News  - ${formatDate(newsData.date)}`}
        </p>

        {/* News Summary */}
        <div className="prose-lg prose max-w-none text-justify leading-relaxed">
          <div className="inline-flex items-center text-lg font-semibold">
            <p>{newsData?.reporter}</p>
          </div>
          <div className="prose-lg prose max-w-none text-justify leading-relaxed">
            {paragraphs.map((paragraph, index) => (
              <p className="mb-2" key={index}>{paragraph}</p>
            ))}
            <div>
              <p className="inline-flex items-center text-lg font-semibold">
                {newsData?.summaryHighlightheadinq}
              </p>
              <section>
                {newsData?.summaryHighlight}
              </section>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default NewsDetail;
