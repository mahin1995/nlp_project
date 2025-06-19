"use client";
import Chatbot from "@/component/Chatbot";
import BBCNewsClone from "@/component/section/BBCNewsClone";
import NewsArticleLayout from "@/component/section/NewsArticleLayout";
import NewsGrid from "@/component/section/NewsGrid";
import TechNewsPage from "@/component/section/TechNewsPage";
import TrendingHead from "@/component/Tranding";
import { useModal } from "@/provider/ModalProvider";
import { NewsService } from "@/service/news-service";
import { HomeResponse } from "@/utils/utils";
import { useQuery } from "@tanstack/react-query";
import AuthenticationModal from "./AuthenticationModal";
import SportNews from "./section/SportNews";
export default function HomeComponent() {
  const { data: homeData } = useQuery({
    queryKey: ["home"], // Include page and limit in query key
    queryFn: NewsService.getHomePageData, // Pass dynamic page and limit
    // keepPreviousData: true, // Keeps previous data while fetching new data
  });
  const bangladesh = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "Bangladesh"
  );
  const world = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "World"
  );
  const sportNews = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "Sports"
  );
  const technology = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "Technology"
  );
  const usNews = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "Us-News"
  );
  const Entertainment = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "Entertainment"
  );
  const lifestyle = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "Lifestyle"
  );
  const feature = homeData?.data.find(
    (a: HomeResponse) => a.categoryName == "Feature"
  );
  const { isModalOpen, closeModal, modalType } = useModal();

  return (
    <>
      <AuthenticationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        modalType={modalType}
      />
      {/* <BlogLayout /> */}
      <TrendingHead />
      <div className="mt-1">
        <NewsGrid news={bangladesh} />
        <BBCNewsClone news={world} />
        <SportNews news={sportNews} />
        <NewsArticleLayout news={technology} />
        <TechNewsPage news={usNews} />

        <NewsArticleLayout news={Entertainment} />
        <SportNews news={feature} />

        <BBCNewsClone news={lifestyle} />
      </div>
      <Chatbot />
    </>
  );
}
