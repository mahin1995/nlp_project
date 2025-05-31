import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Compute the group start page
  const groupSize = 10;
  const currentGroupStart =
    Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
  const currentGroupEnd = Math.min(
    currentGroupStart + groupSize - 1,
    totalPages
  );

  // Create visible page range
  const visiblePages = Array.from(
    { length: currentGroupEnd - currentGroupStart + 1 },
    (_, idx) => currentGroupStart + idx
  );

  return (
    <div className="flex items-center justify-between border-t border-gray-200 dark:bg-black bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white dark:bg-black px-4 py-2 text-sm font-medium dark:text-amber-50 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:text-white bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-white">
            Showing{" "}
            <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * 10, totalItems)}
            </span>{" "}
            of <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 dark:text-white dark:hover:text-black text-gray-400 ring-1 ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
            >
              Previous
            </button>

            {currentGroupStart > 1 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-gray-300 hover:bg-gray-50 dark:hover:bg-amber-50 dark:hover:text-black"
                >
                  1
                </button>
                <span className="px-2 py-2 text-gray-500 dark:text-white">
                  ...
                </span>
              </>
            )}

            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "text-gray-900 dark:text-white ring-1 ring-gray-300 hover:bg-gray-50 dark:hover:bg-amber-50 dark:hover:text-black"
                } focus:z-20`}
              >
                {page}
              </button>
            ))}

            {currentGroupEnd < totalPages && (
              <>
                <span className="px-2 py-2 text-gray-500 dark:text-white">
                  ...
                </span>
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-gray-300 hover:bg-gray-50 dark:hover:bg-amber-50 dark:hover:text-black"
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 dark:text-white dark:hover:text-black text-gray-400 ring-1 ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
