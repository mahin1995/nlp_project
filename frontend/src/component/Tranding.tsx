import { CategoryService } from "@/service/category-service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface TrendingTag {
  id: string;
  name: string;
  link: string;
}

const TrendingHead: React.FC = () => {
  const { data: tranding_itmes } = useQuery({
    queryKey: ["category"], // Include page and limit in query key
    queryFn: CategoryService.getAll, // Pass dynamic page and limit
    // keepPreviousData: true, // Keeps previous data while fetching new data
  });

  return (
    <div className="main-container overflow-hidden mt-4">
      <div className="grid grid-cols-2 items-center justify-between -mt-1.5 mb-2.5">
        <div className="col-span-2 flex flex-wrap max-sm:flex-nowrap justify-start ">
          <div className="w-full flex items-center gap-x-5">
            <div className="flex max-sm:flex-nowrap items-center">
              <div className="mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-[43px] w-[43px]"
                  fill="#D12026"
                  transform="rotate(315)"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillOpacity="0.3"
                    d="M9.9 5C6.8 5 4 6.4 2.2 8.7l1.1 1.1c1.6-2 4-3.2 6.7-3.2s5.1 1.3 6.7 3.2l1.1-1.1C15.8 6.4 13 5 9.9 5z"
                  >
                    <animate
                      id="A"
                      attributeName="fill-opacity"
                      begin="B.end+0.05s"
                      calcMode="linear"
                      dur="450ms"
                      values="0.5;1;0.5"
                    />
                  </path>
                  <path
                    fillOpacity="0.3"
                    d="M9.9 8c-2.3 0-4.3 1.1-5.6 2.8l1.1 1.1c1-1.4 2.6-2.4 4.5-2.4s3.5.9 4.5 2.4l1.1-1.1C14.2 9.1 12.2 8 9.9 8z"
                  >
                    <animate
                      id="B"
                      attributeName="fill-opacity"
                      begin="C.end+0.05s"
                      calcMode="linear"
                      dur="450ms"
                      values="0.5;1;0.5"
                    />
                  </path>
                  <path
                    fillOpacity="0.3"
                    d="M9.9 11c-1.5 0-2.7.8-3.4 2l1.1 1.1c.4-.9 1.3-1.6 2.3-1.6s2 .7 2.3 1.6l1.1-1.1c-.7-1.2-1.9-2-3.4-2z"
                  >
                    <animate
                      id="C"
                      attributeName="fill-opacity"
                      begin="D.end+0.05s"
                      calcMode="linear"
                      dur="450ms"
                      values="0.5;1;0.5"
                    />
                  </path>
                  <circle cx="9.9" cy="15.3" r="1" fillOpacity="0.3">
                    <animate
                      id="D"
                      attributeName="fill-opacity"
                      begin="0s;A.end+0.05s"
                      calcMode="linear"
                      dur="450ms"
                      values="0.5;1;0.5"
                    />
                  </circle>
                </svg>
              </div>

              <div className="curveD flex dark:text-white text-black">
                <div className="curveDesign">
                  <span className="transform pl-1 text-[.9rem]">Tranding</span>
                </div>
                <div className="curveDesign2">
                  <span className="pl-4 pr-3 text-[.9rem]">Category</span>
                </div>
              </div>

              <div className="ml-3">
                <div className="absolute w-0.5 h-[30px] bg-[#E9E9E9]"></div>
                <div className="flex whitespace-nowrap max-sm:flex-nowrap max-sm:truncate items-center justify-start gap-2 list-none ml-3 w-full">
                  {tranding_itmes?.data?.length > 0 &&
                    tranding_itmes?.data?.map((menu: TrendingTag) => (
                      <Link
                        href={"/news-page/category/" + menu?.link}
                        legacyBehavior
                        key={menu.id}
                      >
                        <a className="bg-[#e8e8e9] dark:bg-slate-500 rounded-[50px] hover:drop-shadow-md">
                          <p className="text-[.9rem] outline-none px-3 cursor-pointer hover:text-[#D12026] dark:hover:text-[#d8d7d7]">
                            {menu?.name}
                          </p>
                        </a>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingHead;
