// pages/news/[id].tsx

"use client";
import React, { useState, useEffect } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Image from "next/image";
import { getDocumentById } from "@/lib/actions"; // Assuming you have this function to fetch a single document by ID
import { MapPinIcon } from "@heroicons/react/24/solid";
interface NewsData {
  id: string;
  files: string[];
  title: string;
  newsId: string;
  summary: string;
  date: string;
  downloadURLs: string[];
}

const NewsDetail: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { id } = params;
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  console.log("newsData", id);
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
  const formatDate = (dateString:any) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`); // Convert to yyyy-mm-dd format
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  return (
    <DefaultLayout>
      <Breadcrumbs>
        <BreadcrumbItem href="/home">Home</BreadcrumbItem>
        <BreadcrumbItem href="">Breadcrumbs</BreadcrumbItem>
      </Breadcrumbs>
      <div className="container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Title of the news */}
        <h1 className="text-gray-900 mb-6 text-4xl font-extrabold leading-tight">
          {newsData.title}
        </h1>

        {/* Image Carousel */}
        <div className="carousel mb-8 w-full">
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

        {/* Author and Date */}
        <p className="mb-6 inline-flex items-center text-lg font-semibold text-blue-700">
          <MapPinIcon className="mr-2 h-5 w-5 text-rose-600" />
          {`By Sangli Express News  - ${formatDate(newsData.date)}`}
        </p>

        {/* News Summary */}
        <div className="prose-lg prose max-w-none text-justify leading-relaxed">
          <p>{newsData.summary}</p>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default NewsDetail;
