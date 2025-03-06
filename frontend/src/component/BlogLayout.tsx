"use client";
import { INews, NewsService } from "@/service/news-service";
import ThemeToggle from "@/theme/theme-toggle";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import Pagination from "./Pagination";
import TrendingHead from "./Tranding";

const BlogLayout = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["news", page, limit], // Include page and limit in query key
    queryFn: () => NewsService.getAllNews(page, limit), // Pass dynamic page and limit
    // keepPreviousData: true, // Keeps previous data while fetching new data
  });
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  return (
    <div className="max-w-screen-xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between py-2 border-b">
        <a
          href="#"
          className="px-2 lg:px-0 uppercase font-bold text-purple-800"
        >
          <Image src={"/logo dark.jpg"} width={200} height={200} alt={""} />
        </a>
        <ul className="inline-flex items-center">
          {["Home", "Category", "Login", "Register"].map((item, index) => (
            <li
              key={index}
              className={`px-2 md:px-4 ${index >= 4 ? "hidden md:block" : ""}`}
            >
              <a
                href="#"
                className={`text-${
                  index === 0 ? "purple-600" : "gray-500"
                } font-semibold hover:text-purple-500`}
              >
                {item}
              </a>
            </li>
          ))}
          <li className={`px-2 md:px-4`}>
            <ThemeToggle />
          </li>
        </ul>
      </header>

      {/* Main Content */}

      <main className="mt-10">
        <TrendingHead />
        <div className="block lg:flex lg:space-x-2 px-2 lg:p-0 mt-10 mb-10">
          {/* post cards */}
          <div className="w-full lg:w-2/3">
            {data?.pageData?.map((news: INews) => (
              <div key={news?._id}>
                <a
                  className="block p-2 bg-gray-100 dark:bg-gray-800 rounded w-full lg:flex mb-10 shadow-2xl"
                  href={news?.link}
                >
                  <div
                    className="h-48 lg:w-48 flex-none bg-top text-center overflow-hidden opacity-75"
                    style={{
                      backgroundImage: "url('/brand_image.png')",
                    }}
                    title="deit is very important"
                  ></div>
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
                        {news?.image ? (
                          <Image
                            src={news?.image}
                            alt="Eduard Franz"
                            width={100}
                            height={100}
                          />
                        ) : (
                          <Image
                            src="/person.png"
                            alt="Eduard Franz"
                            width={100}
                            height={100}
                          />
                        )}
                      </div>

                      <div>
                        <p className="font-semibold dark:text-white text-gray-700 text-sm capitalize">
                          {news.author}
                        </p>
                        <p className="dark:text-white text-gray-600 text-xs">
                          {news.publishedAt.toString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
            {isLoading && <div>Loading</div>}
            {isError && <div>Error</div>}
            <Pagination
              currentPage={data?.currentPage || 1}
              totalPages={data?.totalPages || 1}
              totalItems={data?.totalItems || 0}
              onPageChange={handlePageChange}
            />
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
                {["Nutrition", "Food & Diet", "Workouts", "Immunity"].map(
                  (topic, index) => (
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
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogLayout;
