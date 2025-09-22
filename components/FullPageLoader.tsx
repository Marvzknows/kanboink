import React from "react";

const FullPageLoader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50 dark:bg-secondary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 dark:text-white text-lg font-medium">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default FullPageLoader;
