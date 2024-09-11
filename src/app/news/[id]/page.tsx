import { getDocumentById } from "@/lib/actions";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { NewsData } from "@/types/newsData";
import Image from "next/image";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Link from 'next/link';

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const newsData = await getDocumentById(params.id) as NewsData;

  if (!newsData) {
    return {
      title: "News not found",
      description: "The news article you're looking for does not exist.",
    };
  }

  return {
    title: newsData.title,
    description: newsData.summary,
    openGraph: {
      title: newsData.title,
      description: newsData.summary,
      url: `${window.location.origin}/news/${params.id}`,

      images: [
        {
          url: newsData.downloadURLs[0],
          width: 800,
          height: 600,
          alt: newsData.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: newsData.title,
      description: newsData.summary,
      images: [newsData.downloadURLs[0]],
    },
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const newsData = await getDocumentById(params.id) as NewsData;

  if (!newsData) {
    return <div>News not found</div>;
  }

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split("/");
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    });
  };

  const formattedDate = formatDate(newsData.date);
  const paragraphs = newsData.summary.split("\n");

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