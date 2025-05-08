"use client";
import { CategoryService } from "@/service/category-service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

function CategoryComponent() {
  const { data } = useQuery({
    queryKey: ["news"], // Include page and limit in query key
    queryFn: CategoryService.getAll, // Pass dynamic page and limit
    // keepPreviousData: true, // Keeps previous data while fetching new data
  });
  return (
    <div>
      {" "}
      <div className="w-full lg:w-1/3 px-3 mt-10">
        {/* Topics */}
        <div className="mb-4">
          <h5 className="font-bold text-lg uppercase dark:text-white text-gray-700 px-1 mb-2">
            {" "}
            Category{" "}
          </h5>
          <ul>
            {data &&
              data.data &&
              data.data.map(
                (topic: { id: string; name: string }, index: number) => (
                  <li
                    key={topic.id}
                    className="px-1 py-4 border-b  hover:border-gray-200 transition duration-300"
                  >
                    <Link
                      href={"/news-page/category/" + topic.name}
                      className="flex items-center dark:text-white text-gray-600 cursor-pointer"
                    >
                      <span
                        className={`inline-block h-4 w-4 bg-${
                          ["green", "indigo", "yellow", "blue"][index]
                        }-300 mr-3`}
                      ></span>
                      {topic.name}
                    </Link>
                  </li>
                )
              )}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default CategoryComponent;
