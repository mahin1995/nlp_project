import { INews } from "@/service/news-service";
import { HomeResponse } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import SideBar from "./SideBar";

const NewsGrid = ({ news }: { news: HomeResponse }) => {
  return (
    <div className="max-w-screen-xl mx-auto relative p-2 sm:p-0">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-10">
        {/* Main Article Section */}

        <div className="sm:col-span-3 lg:col-span-6">
          {" "}
          <div className="flex flex-row gap-1">
            {news &&
              news.news &&
              news?.news.slice(0, 2).map((a: INews) => (
                <>
                  <div className="">
                    <Link href={`${a.link}`}>
                      <div
                        className="bg-cover text-center overflow-hidden"
                        style={{
                          minHeight: "200px",
                          //   backgroundImage: `url(${
                          //     (a && a.image) || "/brand_image.png"
                          //   })`,
                        }}
                        // title={a && truncateText(a.title, 50)}
                      >
                        <Image
                          src={a?.image || "/brand_image.png"}
                          width={400}
                          height={500}
                          alt="a && truncateText(a.title, 50)"
                        />
                      </div>
                    </Link>
                    <div className="mt-3 text-center dark:bg-black bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
                      <div>
                        <Link
                          href={"/news-page/category/" + news?.categoryName}
                          className="text-xs text-indigo-600 uppercase dark:text-white font-medium hover:text-gray-900 transition duration-500 ease-in-out"
                        >
                          {news && news?.categoryName && news?.categoryName}
                        </Link>
                        <Link
                          href="#"
                          className="block dark:text-white text-gray-900 font-bold text-2xl mb-2 hover:text-indigo-600 transition duration-500 ease-in-out"
                        >
                          {a && a.title}
                        </Link>
                        <p className="text-gray-700  text-base mt-2 mx-5 sm:mx-10">
                          {/* {a && truncateText(a.content, 100)} */}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ))}
          </div>
          <div className="flex flex-row gap-1">
            {news &&
              news.news &&
              news?.news.slice(2, 4).map((a: INews) => (
                <>
                  <div className="">
                    <Link href={`${a.link}`}>
                      <div
                        className="bg-cover text-center overflow-hidden"
                        style={{
                          minHeight: "200px",
                          //   backgroundImage: `url(${
                          //     (a && a.image) || "/brand_image.png"
                          //   })`,
                        }}
                        // title={a && truncateText(a.title, 50)}
                      >
                        <Image
                          src={a?.image || "/brand_image.png"}
                          width={400}
                          height={500}
                          alt="a && truncateText(a.title, 50)"
                        />
                      </div>
                    </Link>
                    <div className="mt-3 text-center dark:text-white dark:bg-black bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">
                      <div>
                        <Link
                          href={"/news-page/category/" + news?.categoryName}
                          className="text-xs dark:text-white text-indigo-600 uppercase font-medium hover:text-gray-900 transition duration-500 ease-in-out"
                        >
                          {news && news?.categoryName && news?.categoryName}
                        </Link>
                        <Link
                          href={a.link}
                          className="block text-gray-900 dark:text-white font-bold text-2xl mb-2 hover:text-indigo-600 transition duration-500 ease-in-out"
                        >
                          {a && a.title}
                        </Link>
                        <p className="text-gray-700 dark:text-white text-base mt-2 mx-5 sm:mx-10">
                          {/* {a && truncateText(a.content, 100)} */}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ))}
          </div>
        </div>
        {/* Sidebar Articles Section */}
        <div className="sm:col-span-12 lg:col-span-3">
          {news?.news.slice(4, 7).map((article, index) => (
            <div className="mb-2" key={index}>
              <a href="#">
                <div
                  className="h-40 bg-cover text-center overflow-hidden"
                  style={{ backgroundImage: `url(${article.image})` }}
                  title={article.title}
                ></div>
              </a>
              <a
                href="#"
                className="text-gray-900 dark:text-white inline-block font-semibold text-md my-2 hover:text-indigo-600 transition duration-500 ease-in-out"
              >
                {article.title}
              </a>
            </div>
          ))}
        </div>
        <SideBar />
      </div>
    </div>
  );
};

export default NewsGrid;
