"use client";
import Chatbot from "@/component/Chatbot";
import BBCNewsClone from "@/component/section/BBCNewsClone";
import NewsArticleLayout from "@/component/section/NewsArticleLayout";
import NewsGrid from "@/component/section/NewsGrid";
import TechNewsPage from "@/component/section/TechNewsPage";
import TrendingHead from "@/component/Tranding";
import { NewsService } from "@/service/news-service";
import { HomeResponse } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import SportNews from "./section/SportNews";
import AuthenticationModal from "./AuthenticationModal";
import { useModal } from "@/app/ModalProvider";
import { useAuth } from "@/app/AuthContextProviders";
export default function HomeComponent() {
  const { data: homeData } = useQuery({
    queryKey: ["home"], // Include page and limit in query key
    queryFn: NewsService.getHomePageData, // Pass dynamic page and limit
    // keepPreviousData: true, // Keeps previous data while fetching new data
  });
  console.log("My Log data: ", homeData);
  const bangladesh = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "Bangladesh"
  );
  const world = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "world"
  );
  const sportNews = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "Sports"
  );
  const technology = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "Technology"
  );
  const usNews = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "us-news"
  );
  let {isModalOpen,closeModal,modalType}=useModal()

  return (
    <>
    <AuthenticationModal isOpen={isModalOpen} onClose={closeModal} modalType={modalType} />
      {/* <BlogLayout /> */}
      <TrendingHead />
      <div className="mt-1">
        <NewsGrid news={bangladesh} />
        <div className="bbc-news-clone">
          <BBCNewsClone news={world} />
        </div>
        <SportNews news={sportNews} />
        <NewsArticleLayout news={technology} />
        <TechNewsPage news={usNews} />
      </div>
      <Chatbot />
    </>
  );
}
