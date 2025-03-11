import { HomeResponse, truncateText } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

const BBCNewsClone = ({ news }: { news: HomeResponse }) => {
  return (
    <div className="font-inter">
      {/* News Section */}
      <div className="py-4">
        <div className="container px-1 mx-auto">
          <div className="text-2xl pl-4 border-l-4 border-red-500 font-bold dark:text-white text-gray-600">
            {(news?.categoryName && news?.categoryName.toUpperCase()) || "News"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4">
            {news &&
              news.news &&
              news?.news?.slice(0, 4).map((item, index) => (
                <div key={index} className="card">
                  <div className="card-body pb-2 border-b lg:border-b-0">
                    <div
                      className="relative card-image hidden md:grid w-full brightness transition duration-300"
                      //   src={item.image}
                      //   alt={item.title}
                    >
                      <Image
                        src={item?.image}
                        alt={""}
                        width={300}
                        height={200}
                        // fill
                        className="object-contain"
                      />
                    </div>
                    <div className="card-title text-base lg:text-xl font-semibold pt-2 dark:text-white text-black">
                      <a
                        href="https://www.bbc.com/news/live/world-asia-58219963"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {truncateText(item.title, 50)}
                      </a>
                    </div>
                    <div className="card-title text-base hidden md:contents dark:text-white text-black pt-2">
                      {truncateText(item.content, 100)}
                    </div>
                    <div className="card-link no-decoration hover:underline mt-2 text-sm lg:text-base pl-2 text-black dark:text-white border-l-2 border-red-500">
                      <Link href={"/category/" + item?.categoryDetails?.name}>
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
  );
};

export default BBCNewsClone;
