import { GetStaticProps, GetStaticPaths } from 'next';
import { getDocumentById, getAllNewsIds } from "@/lib/actions";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { NewsData } from "@/types/newsData";
import Image from "next/image";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Link from 'next/link';
import { useMemo } from 'react';

export const getStaticPaths: GetStaticPaths = async () => {
  const newsIds = await getAllNewsIds();
  
  return {
    paths: newsIds.map((id) => ({ params: { id } })),
    fallback: 'blocking'
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const newsData = await getDocumentById(params?.id as string) as NewsData;
  
  if (!newsData) {
    return { notFound: true };
  }

  return {
    props: { newsData },
    revalidate: 60 * 60 // Revalidate every hour
  };
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const documentData = await getDocumentById(params.id) as NewsData;

  if (!documentData) {
    return {
      title: "News not found",
      description: "The news article you're looking for does not exist.",
    };
  }

  return {
    title: documentData.title,
    description: documentData.summary,
    openGraph: {
      title: documentData.title,
      description: documentData.summary,
      url: `${window.location.origin}/news/${params.id}`,
      images: [
        {
          url: documentData.downloadURLs[0],
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
      images: [documentData.downloadURLs[0]],
    },
  };
}

export default function NewsDetailPage({ newsData }: { newsData: NewsData }) {
  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const formattedDate = useMemo(() => formatDate(newsData.date), [newsData.date]);
  const paragraphs = useMemo(() => newsData.summary.split("\n"), [newsData.summary]);

  if (!newsData) {
    return <>No Data Found</>;
  }

  return (
    <DefaultLayout>
      <article className="container mx-auto overflow-hidden rounded-lg bg-white px-4 py-8 shadow-lg">
        <h1 className="text-4xl font-extrabold leading-tight text-slate-700 mb-4">
          {newsData.title}
        </h1>
        {newsData.subtitle && (
          <h2 className="text-gray-900 text-3xl font-extrabold leading-tight mb-4">
            {newsData.subtitle}
          </h2>
        )}

        <div className="carousel mb-2 w-full">
          {newsData.downloadURLs?.map((file, index) => (
            <div
              key={index}
              id={`slide-${newsData.id}-${index}`}
              className="carousel-item relative w-full"
            >
              <Image
                src={file}
                alt={`${newsData.title} - Image ${index + 1}`}
                className="w-full rounded-lg object-cover"
                width={800}
                height={400}
                priority={index === 0}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <Link href={`#slide-${newsData.id}-${index === 0 ? newsData.downloadURLs.length - 1 : index - 1}`} className="btn btn-circle">
                  ❮
                </Link>
                <Link href={`#slide-${newsData.id}-${(index + 1) % newsData.downloadURLs.length}`} className="btn btn-circle">
                  ❯
                </Link>
              </div>
            </div>
          ))}
        </div>

        {newsData.photoCaption && (
          <p className="mb-4 ml-2 inline-flex items-center text-lg font-semibold">
            {newsData.photoCaption}
          </p>
        )}

        <p className="mb-4 inline-flex items-center text-lg font-semibold text-blue-700">
          <MapPinIcon className="mr-2 h-5 w-5 text-rose-600" aria-hidden="true" />
          <span>Sangli Express News - {formattedDate}</span>
        </p>

        <div className="prose-lg prose max-w-none text-justify leading-relaxed">
          {newsData.reporter && (
            <p className="inline-flex items-center text-lg font-semibold">
              {newsData.reporter}
            </p>
          )}
          {paragraphs.map((paragraph, index) => (
            <p className="mb-2" key={index}>
              {paragraph}
            </p>
          ))}
          {newsData.summaryHighlightheadinq && (
            <div>
              <h3 className="inline-flex items-center text-lg font-semibold">
                {newsData.summaryHighlightheadinq}
              </h3>
              {newsData.summaryHighlight && (
                <section>{newsData.summaryHighlight}</section>
              )}
            </div>
          )}
        </div>
      </article>
    </DefaultLayout>
  );
}