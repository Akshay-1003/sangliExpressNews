"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useForm } from "react-hook-form";
import { createDocument } from "@/lib/actions";
import generateUniqueKey from "@/lib/useUniqueId";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/solid";
const CreateNews = () => {
  const router = useRouter();
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const onSubmit = async (values: any) => {
    const uniqueId = generateUniqueKey();

    const uploadedFiles = await Promise.all(
      selectedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("File upload failed");
        }

        const result = await response.json();
        return result;
      }),
    );

    const fileData = {
      newsId: uniqueId,
      date: new Date().toLocaleDateString(),
      files: uploadedFiles.map((file) => file.fileId),
      summary: values.summary,
      title: values.title,
      reporter: values.reporter,
      subtitle: values.subtitle,
      summaryHighlightheadinq: values.summaryHighlightheadinq,
      summaryHighlight: values.summaryHighlight,
      photoCaption: values.photoCaption,
      downloadURLs: uploadedFiles.map((file) => file.downloadURL),
    };

    try {
      const docId = await createDocument("news", fileData);
      console.log("Document created with ID:", docId);

      toast.success("News Submitted Successfully!", {
        position: "bottom-left",
      });

      router.push("/home"); // Redirect to home after successful submission
    } catch (error) {
      console.error("Error adding document:", error);
      toast.error("Something went wrong!!", {
        position: "bottom-center",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);

      const fileURLs = files.map((file) => URL.createObjectURL(file));
      setFilePreviews((prevPreviews) => [...prevPreviews, ...fileURLs]);
    } else {
      setFilePreviews([]);
    }
  };
  const handleImageClick = (preview: string) => {
    setSelectedFile(preview); // Open the clicked image in full size
  };

  const closeModal = () => {
    setSelectedFile(null); // Close the modal
  };
  const handleRemoveattachedFile = (index: number) => {
    if (index > -1) {
      const updatedPreviews = [...filePreviews];
      const updatedFiles = [...selectedFiles];
      updatedPreviews.splice(index, 1);
      setFilePreviews(updatedPreviews);
      setSelectedFiles(updatedFiles);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <DefaultLayout>
      <div className="mx-auto mt-10 max-w-xl rounded-lg bg-white p-8 shadow-xl">
        <h2 className="text-gray-800 mb-8 text-center text-3xl font-semibold">
          Create News
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* News Title */}
          <div>
            <label
              htmlFor="title"
              className="text-gray-700 block text-sm font-medium"
            >
              News Title
            </label>
            <input
              type="text"
              id="title"
              {...register("title", { required: "News title is required." })}
              className={`border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.title ? "border-red-500" : ""
              }`}
              placeholder="Enter the subtitle of the news"
            />
            {errors.title && (
              <p className="text-red-500 mt-2 text-sm">
                News title is required.
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="subtitle"
              className="text-gray-700 block text-sm font-medium"
            >
              News Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              {...register("subtitle", {
                required: false,
              })}
              className={`border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 `}
              placeholder="Enter the subtitle of the news"
            />
           
          </div>
          {/* Upload Files */}
          <div>
            <label
              htmlFor="files"
              className="text-gray-700 block text-sm font-medium"
            >
              Upload Files
            </label>
            <input
              type="file"
              id="files"
              multiple
              {...register("files", {
                required: false,
              })}
              className={`border-gray-300 bg-gray-50 text-gray-700 mt-2 block w-full cursor-pointer rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
              onChange={handleFileChange}
            />
            

            {/* File Previews */}
            {filePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-700 text-sm font-medium">
                  File Previews:
                </p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  {filePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        width={100}
                        height={100}
                        className="h-32 w-full rounded-lg object-cover shadow-sm"
                        onClick={() => handleImageClick(preview)} // Zoom in on click
                      />
                      <button
                        className="bg-red-600 absolute right-0 top-0 rounded-full p-1 text-white"
                        onClick={() => handleRemoveattachedFile(index)}
                      >
                        <TrashIcon className="h-5 w-5 text-rose-600"></TrashIcon>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="title"
              className="text-gray-700 block text-sm font-medium"
            >
              Photo Caption
            </label>
            <input
              type="text"
              id="photoCaption"
              {...register("photoCaption", {
                required: false,
              })}
              className={`border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 `}
              placeholder="Enter the title of the news"
            />
            
          </div>
          <div>
            <label
              htmlFor="title"
              className="text-gray-700 block text-sm font-medium"
            >
              Reporter Name
            </label>
            <input
              type="text"
              id="reporter"
              {...register("reporter", {
                required: "News reporter is required.",
              })}
              className={`border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.reporter ? "border-red-500" : ""
              }`}
              placeholder="Enter the title of the news"
            />
            {errors.reporter && (
              <p className="text-red-500 mt-2 text-sm">
                News reporter is required.
              </p>
            )}
          </div>

          {/* News Summary */}
          <div>
            <label
              htmlFor="summary"
              className="text-gray-700 block text-sm font-medium"
            >
              News Summary
            </label>
            <textarea
              id="summary"
              rows={4}
              {...register("summary", { required: "Summary is required." })}
              className={`border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                errors.summary ? "border-red-500" : ""
              }`}
              placeholder="Write the news summary here..."
            ></textarea>
            {errors.summary && (
              <p className="text-red-500 mt-2 text-sm">Summary is required.</p>
            )}
          </div>
          <div>
            <label
              htmlFor="title"
              className="text-gray-700 block text-sm font-medium"
            >
              Summary Highlight Heading
            </label>
            <input
              type="text"
              id="summaryHighlightheadinq"
              {...register("summaryHighlightheadinq", { required: false })}
              className={`border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 `}
              placeholder="Enter the title of the news"
            />
            
          </div>
          <div>
            <label
              htmlFor="title"
              className="text-gray-700 block text-sm font-medium"
            >
              Summary Highlight{" "}
            </label>
            <input
              type="text"
              id="summaryHighlight"
              {...register("summaryHighlight", {
                required: false,
              })}
              className={`border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 `}
              placeholder="Enter the summaryHighlight of the news"
            />
           
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="inline-block w-full rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit News
            </button>
          </div>
        </form>

        {/* Image Zoom Modal */}
        {selectedFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="relative">
              <Image
                src={selectedFile}
                alt="Zoomed preview"
                width={800}
                height={400}
                className="max-h-screen max-w-full rounded-lg"
                onClick={closeModal}
              />
              <button
                className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-black shadow-md"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default CreateNews;
