import { getDocumentById } from "@/lib/actions";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { NewsData } from "../../../types/newsData";
import { MapPinIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

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

  return (
    <DefaultLayout>
      <div className="container mx-auto overflow-hidden rounded-lg bg-white px-4 py-8 shadow-lg">
        <div className="mb-4">
          <h1 className="text-4xl font-extrabold leading-tight text-slate-700">
            {newsData?.title}
          </h1>
        </div>
        <div className="text-gray-900 mb-4 text-3xl font-extrabold leading-tight">
          <h2>{newsData?.subtitle}</h2>
        </div>

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
                  href={`#slide-${newsData.id}-${index === 0 ? newsData.downloadURLs.length - 1 : index - 1}`}
                  className="btn btn-circle"
                >
                  ❮
                </a>
                <a
                  href={`#slide-${newsData.id}-${(index + 1) % newsData.downloadURLs.length}`}
                  className="btn btn-circle"
                >
                  ❯
                </a>
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="mb-4 ml-2 inline-flex items-center text-lg font-semibold ">
            {newsData?.photoCaption}
          </p>
        </div>

        <p className="mb-4 inline-flex items-center text-lg font-semibold text-blue-700">
          <MapPinIcon className="mr-2 h-5 w-5 text-rose-600" />
          {`Sangli Express News  - ${formatDate(newsData.date)}`}
        </p>

        <div className="prose-lg prose max-w-none text-justify leading-relaxed">
          <div className="inline-flex items-center text-lg font-semibold">
            <p>{newsData?.reporter}</p>
          </div>
          <div className="prose-lg prose max-w-none text-justify leading-relaxed">
            {paragraphs.map((paragraph, index) => (
              <p className="mb-2" key={index}>
                {paragraph}
              </p>
            ))}
            <div>
              <p className="inline-flex items-center text-lg font-semibold">
                {newsData?.summaryHighlightheading}
              </p>
              <section>{newsData?.summaryHighlight}</section>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
