import { HomeResponse, truncateText } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

const BBCNewsClone = ({ news }: { news: HomeResponse }) => {
  return (
    <div className="bbc-news-clone">
      <div className="font-inter">
        {/* News Section */}
        <div className="py-4">
          <div className="container px-1 mx-auto">
            <div className="text-2xl pl-4 border-l-4 border-red-500 font-bold dark:text-white text-gray-600">
              {(news?.categoryName && news?.categoryName.toUpperCase()) ||
                "News"}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4">
              {news &&
                news.news &&
                news?.news?.slice(0, 4).map((item, index) => (
                  <div key={index} className="card">
                    <div className="card-body pb-2 border-b lg:border-b-0">
                      <div
                        className="relative card-image md:grid transition duration-300"
                        style={{ minHeight: "180px" }}
                      >
                        <Image
                          src={item?.image || "/placeholder.png"}
                          alt={item?.title || "News image"}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 300px"
                          priority
                        />
                      </div>
                      <div className="card-title text-base lg:text-xl font-semibold pt-2 dark:text-white text-black">
                        <Link
                          className="no-decoration hover:underline"
                          legacyBehavior
                          href={`/news-page/details/${item._id || item.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {truncateText(item.title, 50)}
                        </Link>
                      </div>
                      <div className="card-title text-base hidden md:contents dark:text-white text-black pt-2">
                        {truncateText(item.content, 100)}
                      </div>
                      <div className="card-link no-decoration hover:underline mt-2 text-sm lg:text-base pl-2 text-black dark:text-white border-l-2 border-red-500">
                        <Link
                          href={
                            "/news-page/category/" + item?.categoryDetails?.name
                          }
                        >
                          {item?.categoryDetails?.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BBCNewsClone;
