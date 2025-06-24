import { formatDate, HomeResponse, truncateText } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

const SportNews = ({ news }: { news: HomeResponse }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 my-0 py-10 px-10 sm:px-16">
      <div className="max-w-screen-xl mx-auto relative">
        <div className="border-b mb-5 flex justify-between text-lg">
          <div className="text-indigo-600 dark:text-white flex items-center pb-2 pr-2 border-b-2 border-indigo-600 uppercase">
            <span className="font-semibold inline-block">
              {news?.categoryName} News
            </span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {news &&
            news?.news &&
            news?.news?.slice(0, 3)?.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-between border-b pb-5"
              >
                <Link
                  href={`/news-page/details/${item._id || item.id}`}
                  className="text-gray-900 dark:text-white text-lg font-bold hover:text-indigo-600"
                >
                  {truncateText(item.title, 40)}
                </Link>
                <div className="flex items-start justify-between mt-3">
                  <div className="text-sm w-2/3">
                    <p className="text-gray-700 dark:text-white">
                      {truncateText(item.content, 50)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-500 text-xs">
                      {item?.publishedAt && formatDate(item?.publishedAt?.toString())}
                    </p>
                  </div>
                  <Link
                    href={`/news-page/details/${item._id || item.id}`}
                    className="inline-block ml-2"
                  >
                    <div
                      className="relative w-20 h-20 bg-cover bg-center"
                      //   style={{ backgroundImage: `url(${item.image})` }}
                    >
                      <Image
                        src={item?.image}
                        fill
                        alt=""
                        className="object-cover"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SportNews;
