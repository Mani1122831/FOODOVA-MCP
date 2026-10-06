import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="card p-4 flex flex-col justify-between animate-pulse bg-white border border-gray-100 rounded-3xl">
      <div className="w-full h-48 bg-gray-200 rounded-2xl mb-4"></div>
      <div className="flex items-center justify-between mb-2">
        <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
        <div className="w-12 h-5 bg-gray-200 rounded-full"></div>
      </div>
      <div className="w-3/4 h-6 bg-gray-200 rounded-md mb-2"></div>
      <div className="w-full h-4 bg-gray-200 rounded-md mb-4"></div>
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="w-20 h-6 bg-gray-200 rounded-md"></div>
        <div className="w-24 h-10 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
