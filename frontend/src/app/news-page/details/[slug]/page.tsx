"use client";

import { NewsService } from "@/service/news-service";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const slug =
    typeof params.slug === "string"
      ? params.slug
      : Array.isArray(params.slug)
      ? params.slug[0]
      : "";
  const { data, isLoading } = useQuery({
    queryKey: ["news_category", slug],
    queryFn: () => NewsService.getNewsById(slug),
    enabled: !!slug,
  });

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="container p-4">
          <div className="card">
            <div className="card-body pb-2 border-b lg:border-b-0">
              <div
                className="relative card-image md:grid transition duration-300"
                style={{ minHeight: "180px" }}
              >
                <Image
                  src={data?.news?.image || "/placeholder.png"}
                  alt={data?.news?.title || "News image"}
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
                  href={`/news-page/details/${
                    data?.news?._id || data?.news?.id
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {data?.news?.title}
                </Link>
                <div className=" ">
                  <Link
                    href={"/news-page/category/" + data?.news?.category?.name}
                    className="text-xs  text-indigo-600 dark:text-indigo-700 uppercase font-medium hover:text-gray-900 dark:hover:text-red-300 transition duration-500 ease-in-out"
                  >
                    {data?.news && data?.news?.category?.name}
                  </Link>
                </div>
              </div>
              <div className="card-title text-base hidden md:contents dark:text-white text-black pt-2">
                {data?.news?.content}
              </div>
              <div className="card-link no-decoration hover:underline mt-2 text-sm lg:text-base pl-2 text-black dark:text-white border-l-2 border-red-500">
                <Link href={data?.news?.link}>Read More</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
