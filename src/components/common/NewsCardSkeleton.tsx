const NewsCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-boxdark rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
        </div>
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mt-4"></div>
      </div>
    </div>
  );
};

export default NewsCardSkeleton;
