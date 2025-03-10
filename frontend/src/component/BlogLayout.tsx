"use client";
import { INews, NewsService } from "@/service/news-service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import Pagination from "./Pagination";
import TrendingHead from "./Tranding";

const BlogLayout = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useQuery({
    queryKey: ["news", page, limit], // Include page and limit in query key
    queryFn: () => NewsService.getAllNews(page, limit), // Pass dynamic page and limit
    // keepPreviousData: true, // Keeps previous data while fetching new data
  });
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  const [imageError, setImageError] = useState(false);
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    setImageError: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setImageError(true);
  };
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-GB", options).replace(",", "");
  }
  return (
    <>
      <main className="mt-10">
        <TrendingHead />
        <div className="block lg:flex lg:space-x-2 px-2 lg:p-0 mt-10 mb-10">
          {/* post cards */}
          <div className="w-full lg:w-2/3">
            {isLoading && (
              <>
                <div role="status">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </>
            )}
            {!isLoading && data && (
              <>
                {data?.pageData?.map((news: INews) => {
                  const imageSrc = imageError
                    ? "/brand_image.png" // Fallback image in the public folder
                    : news?.image;
                  return (
                    <div key={news?._id}>
                      <a
                        className="block p-2 bg-gray-100 dark:bg-gray-800 rounded w-full lg:flex mb-10 shadow-2xl"
                        href={news?.link}
                      >
                        <div
                          className="h-48 lg:w-48 flex-none bg-top text-center overflow-hidden opacity-75"
                          //   style={{
                          //     backgroundImage: `${
                          //       news?.image
                          //         ? `url(${news.image})`
                          //         : `url('/brand_image.png')`
                          //     }`,
                          //   }}
                          title="deit is very important"
                        >
                          {!news?.image ? (
                            <>
                              <Image
                                src="/brand_image.png"
                                alt="Eduard Franz"
                                width={600}
                                height={400}
                              />
                            </>
                          ) : (
                            <>
                              {" "}
                              <Image
                                src={imageSrc}
                                alt={news?.title}
                                width={600}
                                height={400}
                                onError={(e) =>
                                  handleImageError(e, setImageError)
                                } // Handle image load error
                              />
                            </>
                          )}
                        </div>
                        <div className="rounded px-4 flex flex-col justify-between leading-normal">
                          <div className="w-full">
                            <div className="mt-3 md:mt-0 dark:text-white text-gray-700 font-bold text-2xl mb-2">
                              {news?.title}
                            </div>
                            <p className="text-gray-700 dark:text-white text-base">
                              {news?.content}
                            </p>
                          </div>
                          <div className="flex mt-3">
                            <div className="h-10 w-10 rounded-full mr-2 object-cover">
                              <Image
                                src="/person.png"
                                alt="Eduard Franz"
                                width={100}
                                height={100}
                              />
                            </div>

                            <div>
                              <p className="font-semibold dark:text-white text-gray-700 text-sm capitalize">
                                {news.website || "Unknown"}
                              </p>
                              <p className="dark:text-white text-gray-600 text-xs">
                                {formatDate(news.publishedAt.toString())}
                              </p>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                })}

                <Pagination
                  currentPage={data?.currentPage || 1}
                  totalPages={data?.totalPages || 1}
                  totalItems={data?.totalItems || 0}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>

          {/* right sidebar */}
          <div className="w-full lg:w-1/3 px-3 mt-10">
            {/* Topics */}
            <div className="mb-4">
              <h5 className="font-bold text-lg uppercase dark:text-white text-gray-700 px-1 mb-2">
                {" "}
                Popular News{" "}
              </h5>
              <ul>
                {[].map((topic, index) => (
                  <li
                    key={index}
                    className="px-1 py-4 border-b  hover:border-gray-200 transition duration-300"
                  >
                    <a
                      href="#"
                      className="flex items-center dark:text-white text-gray-600 cursor-pointer"
                    >
                      <span
                        className={`inline-block h-4 w-4 bg-${
                          ["green", "indigo", "yellow", "blue"][index]
                        }-300 mr-3`}
                      ></span>
                      {topic}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default BlogLayout;
