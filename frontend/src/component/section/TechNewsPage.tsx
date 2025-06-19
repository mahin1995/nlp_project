import { INews } from "@/service/news-service";
import { formatDate, HomeResponse } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TechNewsPage = ({ news }: { news: HomeResponse }) => {
  // Clock icon SVG component
  const ClockIcon = () => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="far"
      data-icon="clock"
      className="h-3 mr-1"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
    >
      <path
        fill="currentColor"
        d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"
      />
    </svg>
  );

  // Featured news item component
  //   const FeaturedNewsItem: React.FC<{ item: NewsItem }> = ({ item }) => (
  //     <a
  //       href={item.link}
  //       target="_blank"
  //       rel="noopener noreferrer"
  //       className="h-64 md:h-80 w-full md:w-1/2 mx-1.5 mb-4 md:mb-0 group"
  //     >
  //       <div className="h-64 md:h-80 relative">
  //         <img
  //           src={item.image}
  //           className="absolute z-0 object-cover w-full h-64 md:h-80 rounded-lg"
  //           alt={item.title}
  //         />
  //         <div className="absolute gradient w-full h-64 md:h-80 rounded-lg z-10"></div>
  //         <div className="absolute left-0 right-0 bottom-0 p-4 z-30">
  //           <h1 className="font-bold text-white leading-tight sm:mb-2 group-hover:underline text-2xl md:text-3xl">
  //             {item.title}
  //           </h1>
  //           <div className="text-xs text-white hidden sm:block">
  //             <div className="flex items-center">
  //               <ClockIcon />
  //               <span className="text-xs text-white">
  //                 {item.timeAgo} | {item.author}
  //               </span>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </a>
  //   );

  // Regular news item component
  const RegularNewsItem: React.FC<{ item: INews; className?: string }> = ({
    item,
    className,
    ...props
  }) => (
    <Link
     href={`/news-page/details/${item._id||item.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "flex items-center group mb-3 pb-3 border-b border-gray-800 " +
        className
      }
      {...props}
    >
      <div className="relative rounded-md  mr-3 h-24 w-24">
        <Image
          src={item.image}
          fill
          className="object-cover"
          alt={item.title}
        />
      </div>
      <div className="flex-1">
        <h2 className="dark:text-white font-bold text-lg md:text-xl leading-tight transition group-hover:underline mb-2">
          {item.title}
        </h2>
        <div className="flex items-center">
          <ClockIcon />
          <span className="text-xs md:text-sm dark:text-gray-300">
            {formatDate(item.publishedAt.toString())} |{" "}
            <span className="dark:text-gray-300">{item.author}</span>
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="">
      <div className="max-w-screen-xl mx-auto p-4">
        {/* Featured News */}
        <h1 className="text-2xl font-bold mb-6 uppercase">
          {news?.categoryName}
        </h1>
        {/* <div className="flex flex-col md:flex-row -mx-1.5 px-4 pt-4">
          {featuredNews.map((item, index) => (
            <FeaturedNewsItem key={index} item={item} />
          ))}
        </div> */}

        {/* Regular News */}
        <div className="flex flex-col md:flex-row -mx-1.5 p-4">
          <div className="w-full md:w-1/2 mx-1.5">
            {news &&
              news.news &&
              news?.news
                ?.slice(0, 2)
                .map((item, index) => (
                  <RegularNewsItem
                    key={index}
                    item={item}
                    className="flex items-center group mb-3 pb-3 border-b md:mb-0 md:pb-0 md:border-none border-gray-800"
                  />
                ))}
          </div>

          <div className="w-full md:w-1/2 mx-1.5">
            {news &&
              news.news &&
              news?.news
                ?.slice(4, 6)
                .map((item, index) => (
                  <RegularNewsItem
                    key={index}
                    item={item}
                    className="flex items-center group mb-3 pb-3 border-b md:mb-0 md:pb-0 md:border-none border-gray-800"
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechNewsPage;
