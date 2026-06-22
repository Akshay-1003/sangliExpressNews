import { NewspaperIcon } from "@heroicons/react/24/outline";

const EmptyState = ({ message = "No news available" }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <NewspaperIcon className="h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
        No News Found
      </h3>
      <p className="text-gray-500 dark:text-gray-500 text-center">{message}</p>
    </div>
  );
};

export default EmptyState;
