import { INews } from "@/service/news-service";
import Image from "next/image";
import Link from "next/link";

import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Slider from "react-slick";
type CardNewsProps = {
  newsList: INews[];
};

const CardNews: React.FC<CardNewsProps> = ({ newsList }) => {
  function SampleNextArrow(props: React.ComponentProps<"div"> & { onClick?: () => void }) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "black",
          padding: "1px",
        }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props: React.ComponentProps<"div"> & { onClick?: () => void }) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "black",
          padding: "1px",
        }}
        onClick={onClick}
      />
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // className: "bg-black",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="flex justify-center items-center ">
      <div className="max-w-[280px] mx-auto">
        <Slider {...settings}>
          {newsList.map((news, index) => (
            <div
              key={index}
              className="relative flex flex-col overflow-hidden rounded-xl bg-white dark:bg-black shadow-md"
            >
              <div className="relative w-full h-60">
                <Image
                  src={news.image}
                  alt={news.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-xl"
                />
              </div>
              <div className="p-2">
                <h4 className="text-2xl dark:text-white text-black font-semibold text-blue-gray-900">
                  {news.title}
                </h4>
                <p className="truncate mt-1 text-xl dark:text-white text-gray-700">
                  {news.content}
                </p>
                <button className="mt-1 text-xl dark:text-white  text-gray-700 justify-center">
                  <Link href={news.link}>Read more</Link>
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CardNews;
