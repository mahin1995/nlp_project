import { NewsService } from "@/service/news-service";
import { RESPONSE_STATUS } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Define TypeScript interfaces
interface ContentItem {
  id: number;
  imageUrl: string;
  title: string;
  time: string;
  category: string;
}

type TabName = "LATEST" | "POPULAR";

function SideBar() {
  const [activeTab, setActiveTab] = useState<TabName>("LATEST");
  const { data: sideBarData } = useQuery({
    queryKey: ["side-bar-data"], // Include page and limit in query key
    queryFn: NewsService.getSideBarData, // Pass dynamic page and limit
    // keepPreviousData: true, // Keeps previous data while fetching new data
  });
  // Data structure for different tabs
  const tabData: Record<TabName, ContentItem[]> = sideBarData?.data;

  return (
    <div className="xl:col-span-3 lg:col-span-4 lg:block py-6">
      {/* Tab Navigation */}
      <div className="border-b-2 border-yellow-700 border-opacity-10 space-x-5 mb-8">
        {(["LATEST", "POPULAR"] as TabName[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-bold pb-5 font-sans border-b-2 transition-colors ${
              activeTab === tab
                ? "border-red-500 text-black dark:text-white hover:border-red-500"
                : "border-transparent text-gray-600 text-opacity-40 hover:text-opacity-80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      {sideBarData?.status == RESPONSE_STATUS.SUCCESS && (
        <div className="flex flex-col space-y-8">
          {tabData[activeTab].map((item) => (
            <div key={item.id} className="flex">
              <div className="relative w-20 h-20 flex-shrink-0 mr-4">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <div className="flex-grow flex flex-col">
                <Link
                  href={`/news-page/details/${item?.id || item?.id}`}
                  className="mb-0.5 hover:underline line-clamp-2"
                >
                  {item.title}
                </Link>
                <p className="text-gray-600 text-opacity-40 text-xs mt-auto font-sans">
                  {item.time}{" "}
                  <Link
                    href={`/news-page/category/${item.category}`}
                    className="text-blue-400 lg:ml-2 lg:inline block hover:underline"
                  >
                    {item.category}
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Content based on active tab */}
    </div>
  );
}

export default SideBar;
