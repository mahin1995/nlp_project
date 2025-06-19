import { HomeResponse, truncateText } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

const NewsArticleLayout = ({ news }: { news: HomeResponse }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{news?.categoryName} News</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {news?.news?.slice(0, 3).map((article) => (
          <div
            key={article._id}
            className="bg-white dark:bg-black rounded-lg shadow-md overflow-hidden"
          >
            <Link href={`/news-page/details/${article._id || article.id}`}>
              <div className="relative w-full h-48 ">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/news-page/details/${article._id || article.id}`}>
                  {article.title}
                </Link>
              </h2>
              <p className="text-gray-600">
                {truncateText(article.content, 100)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsArticleLayout;
