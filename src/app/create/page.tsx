"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useForm, SubmitHandler } from "react-hook-form";
import { createDocument } from "@/lib/actions";
import generateUniqueKey from "@/lib/useUniqueId";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { TrashIcon } from "@heroicons/react/24/solid";
import {Spinner} from "@nextui-org/react";
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};

interface FormValues {
  title: string;
  subtitle?: string;
  reporter: string;
  summary: string;
  summaryHighlightheading?: string;
  summaryHighlight?: string;
  photoCaption?: string;
}

const CreateNews: React.FC = () => {
  const router = useRouter();
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
    watch,
  } = useForm<FormValues>();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("App resumed from background");
        const savedState = localStorage.getItem("formState");
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          Object.keys(parsedState).forEach((key) => {
            setValue(key as keyof FormValues, parsedState[key]);
          });
        }
      } else {
        const currentState = getValues();
        localStorage.setItem("formState", JSON.stringify(currentState));
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [setValue, getValues]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const saveDraft = () => {
      const currentState = getValues();
      localStorage.setItem("newsDraft", JSON.stringify(currentState));
      console.log("Draft saved");
    };

    const interval = setInterval(saveDraft, 60000);
    return () => clearInterval(interval);
  }, [getValues]);

  const handleDebouncedInputChange = debounce(
    (name: keyof FormValues, value: string) => {
      setValue(name, value, { shouldValidate: true, shouldDirty: true });
    },
    100,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
      const fileURLs = files.map((file) => URL.createObjectURL(file));
      setFilePreviews((prevPreviews) => [...prevPreviews, ...fileURLs]);
    }
  };

  const handleRemoveAttachedFile = (index: number) => {
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      setIsLoading(true);
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
            setIsLoading(false);

            throw new Error(`File upload failed: ${response.statusText}`);
          }

          return await response.json();
        }),
      );

      const fileData = {
        newsId: uniqueId,
        date: new Date().toLocaleDateString(),
        files: uploadedFiles.map((file) => file.fileId),
        ...values,
        downloadURLs: uploadedFiles.map((file) => file.downloadURL),
      };

      const docId = await createDocument("news", fileData);
      console.log("Document created with ID:", docId);

      toast.success("News Submitted Successfully!", {
        position: "bottom-left",
      });
      setIsLoading(false);
      resetForm();
      router.push("/home");
    } catch (error) {
      setIsLoading(false);
      console.error("Error during form submission:", error);
      toast.error("An error occurred during submission. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  const resetForm = () => {
    reset();
    setSelectedFiles([]);
    setFilePreviews([]);
    localStorage.removeItem("formState");
    localStorage.removeItem("newsDraft");
  };

  return (
    <DefaultLayout>
      <div className="mx-auto mt-10 max-w-xl rounded-lg bg-white p-4 shadow-xl">
        <h2 className="text-gray-800 mb-8 text-center text-3xl font-semibold">
          Create News
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
              className={`border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.title ? "border-red-500" : ""}`}
              placeholder="Enter the news title"
              onChange={(e) =>
                handleDebouncedInputChange("title", e.target.value)
              }
              value={watch("title")}
            />
            {errors.title && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.title.message}
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
              {...register("subtitle")}
              className="border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter the subtitle of the news"
              onChange={(e) =>
                handleDebouncedInputChange("subtitle", e.target.value)
              }
              value={watch("subtitle")}
            />
          </div>

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
              className="border-gray-300 bg-gray-50 text-gray-700 mt-2 block w-full cursor-pointer rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={handleFileChange}
            />

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
                        onClick={() => setSelectedFile(preview)}
                      />
                      <button
                        type="button"
                        className="bg-red-600 absolute right-0 top-0 rounded-full p-1 text-white"
                        onClick={() => handleRemoveAttachedFile(index)}
                      >
                        <TrashIcon className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="photoCaption"
              className="text-gray-700 block text-sm font-medium"
            >
              Photo Caption
            </label>
            <input
              type="text"
              id="photoCaption"
              {...register("photoCaption")}
              className="border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter the photo caption"
              onChange={(e) =>
                handleDebouncedInputChange("photoCaption", e.target.value)
              }
              value={watch("photoCaption")}
            />
          </div>

          <div>
            <label
              htmlFor="reporter"
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
              className={`border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.reporter ? "border-red-500" : ""}`}
              placeholder="Enter the reporter's name"
              onChange={(e) =>
                handleDebouncedInputChange("reporter", e.target.value)
              }
              value={watch("reporter")}
            />
            {errors.reporter && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.reporter.message}
              </p>
            )}
          </div>

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
              className={`border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.summary ? "border-red-500" : ""}`}
              placeholder="Write the news summary here..."
              onChange={(e) =>
                handleDebouncedInputChange("summary", e.target.value)
              }
              value={watch("summary")}
            ></textarea>
            {errors.summary && (
              <p className="text-red-500 mt-2 text-sm">
                {errors.summary.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="summaryHighlightheading"
              className="text-gray-700 block text-sm font-medium"
            >
              Summary Highlight Heading
            </label>
            <input
              type="text"
              id="summaryHighlightheading"
              {...register("summaryHighlightheading")}
              className="border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter the summary highlight heading"
              onChange={(e) =>
                handleDebouncedInputChange(
                  "summaryHighlightheading",
                  e.target.value,
                )
              }
              value={watch("summaryHighlightheading")}
            />
          </div>

          <div>
            <label
              htmlFor="summaryHighlight"
              className="text-gray-700 block text-sm font-medium"
            >
              Summary Highlight
            </label>
            <input
              type="text"
              id="summaryHighlight"
              {...register("summaryHighlight")}
              className="border-gray-300 text-gray-700 mt-2 block w-full rounded-lg border p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Enter the summary highlight"
              onChange={(e) =>
                handleDebouncedInputChange("summaryHighlight", e.target.value)
              }
              value={watch("summaryHighlight")}
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="inline-block w-2/5 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                "Submit News"
              )}

            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-500 inline-block w-2/5 rounded-lg px-6 py-3 font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              Reset Form
            </button>
          </div>
        </form>

        {selectedFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="relative">
              <Image
                src={selectedFile}
                alt="Zoomed preview"
                width={800}
                height={400}
                className="max-h-screen max-w-full rounded-lg"
                onClick={() => setSelectedFile(null)}
              />
              <button
                className="absolute right-4 top-4 rounded-full bg-white px-4 py-2 text-black shadow-md"
                onClick={() => setSelectedFile(null)}
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
