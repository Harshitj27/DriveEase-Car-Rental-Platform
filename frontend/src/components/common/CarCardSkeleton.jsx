const CarCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="h-52 bg-gradient-to-br from-gray-200 to-gray-100" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
      <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
      <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="h-6 bg-gray-200 rounded-lg w-1/3" />
        <div className="h-9 bg-primary-100 rounded-xl w-1/4" />
      </div>
    </div>
  </div>
);

export default CarCardSkeleton;
